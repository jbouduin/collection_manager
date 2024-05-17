import { DeleteResult, ExpressionOrFactory, InsertResult, SqlBool, Transaction, UpdateResult } from "kysely";
import { Rulings, Ruling as ScryfallRuling } from "scryfall-sdk";
import { inject, injectable } from "tsyringe";

import { ProgressCallback, RulingSyncOptions } from "../../../../../common/ipc-params";
import { Card, DatabaseSchema } from "../../../../database/schema";
import INFRATOKENS, { IDatabaseService } from "../../../infra/interfaces";
import ADAPTTOKENS, { IRulingAdapter, IRulingLineAdapter } from "../../adapt/interface";
import { IRulingSyncService } from "../interface";
import { BaseSyncService } from "./base-sync.service";


@injectable()
export class RulingSyncService extends BaseSyncService implements IRulingSyncService {

  private rulingLineAdapter: IRulingLineAdapter;
  private rulingAdapter: IRulingAdapter;

  public constructor(@inject(INFRATOKENS.DatabaseService) databaseService: IDatabaseService,
    @inject(ADAPTTOKENS.RulingLineAdapter) rulingLineAdapter: IRulingLineAdapter,
    @inject(ADAPTTOKENS.RulingAdapter) rulingAdapter: IRulingAdapter) {
    super(databaseService);
    this.rulingLineAdapter = rulingLineAdapter;
    this.rulingAdapter = rulingAdapter;
  }

  public async sync(options: RulingSyncOptions, progressCallback?: ProgressCallback): Promise<void> {
    console.log(`start RulingSyncService.sync for cardId ${options.cardId}`);
    if (progressCallback) {
      progressCallback("Synchronizing rulings");
    }
    return Rulings.byId(options.cardId)
      .then((scryFall: Array<ScryfallRuling>) => this.processSync(options.cardId, scryFall));
  }

  private async processSync(cardId: string, rulings: Array<ScryfallRuling>): Promise<void> {
    if (rulings.length > 0) {
      const groupByOracleid: Map<string, Array<ScryfallRuling>> = new Map<string, Array<ScryfallRuling>>();
      rulings.forEach((ruling: ScryfallRuling) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const oracleId = (ruling as any)["oracle_id"] as string;
        if (groupByOracleid.has(oracleId)) {
          groupByOracleid.get(oracleId).push(ruling);
        } else {
          groupByOracleid.set(oracleId, new Array<ScryfallRuling>(ruling));
        }
      });
      if (groupByOracleid.size > 1) {
        console.log("We have an issue here! More then one oracle id found for the same card");
      }
      return this.database.transaction().execute(async (trx: Transaction<DatabaseSchema>) => {
        for (const oracleId of groupByOracleid.keys()) {
          await this.syncRulingForSingleOracleId(trx, oracleId, groupByOracleid.get(oracleId));
        }
      });
    } else {
      return this.database.transaction().execute(async (trx: Transaction<DatabaseSchema>) => {
        trx.selectFrom("card")
          .selectAll()
          .where("card.id", "=", cardId)
          .executeTakeFirst()
          .then((card: Card) => this.syncRulingForSingleOracleId(trx, card.oracle_id, new Array<ScryfallRuling>()));
      });
    }
  }

  private async syncRulingForSingleOracleId(trx: Transaction<DatabaseSchema>, oracleId: string, rulings: Array<ScryfallRuling>): Promise<InsertResult | void> {
    const rulingFilter: ExpressionOrFactory<DatabaseSchema, "ruling", SqlBool> = (eb) => eb("ruling.oracle_id", "=", oracleId);
    const existingRulingPromise = trx
      .selectFrom("ruling")
      .select("ruling.oracle_id")
      .where(rulingFilter)
      .executeTakeFirst();

    const insertOrUpdateRulingPromise = existingRulingPromise.then((queryResult) => {
      let insertedOrUpdatedRuling: Promise<InsertResult | UpdateResult>;
      if (queryResult) {
        insertedOrUpdatedRuling = trx.updateTable("ruling")
          .set(this.rulingAdapter.toUpdate(null))
          .where(rulingFilter)
          .executeTakeFirstOrThrow();
      } else {
        insertedOrUpdatedRuling = trx.insertInto("ruling")
          .values(this.rulingAdapter.toInsert(oracleId))
          .executeTakeFirstOrThrow();
      }
      return insertedOrUpdatedRuling;
    });

    const deleteLinesPromise: Promise<Array<DeleteResult>> = insertOrUpdateRulingPromise.then(() => {
      const rulingLineFilter: ExpressionOrFactory<DatabaseSchema, "ruling_line", SqlBool> = (eb) => eb("ruling_line.oracle_id", "=", oracleId);
      return trx.deleteFrom("ruling_line").where(rulingLineFilter).execute();
    });

    if (rulings.length > 0) {
      return deleteLinesPromise.then(() => {
        const allRulingLines = rulings.map((ruling: ScryfallRuling) => this.rulingLineAdapter.toInsert(oracleId, ruling));
        return trx
          .insertInto("ruling_line")
          .values(allRulingLines)
          .executeTakeFirstOrThrow();
      });
    } else {
      return Promise.resolve();
    }
  }
}
