import { DeleteResult, ExpressionOrFactory, InsertResult, SqlBool, Transaction, UpdateResult } from "kysely";
import { Rulings, Ruling as ScryfallRuling } from "scryfall-sdk";
import { inject, injectable } from "tsyringe";

import { ProgressCallback, RulingSyncOptions } from "../../../../common/ipc-params";
import { DatabaseSchema } from "../../../../main/database/schema";
import ADAPTTOKENS, { IRulingAdapter, IRulingLineAdapter } from "../../adapt/interfaces";
import INFRATOKENS, { IDatabaseService } from "../../infra/interfaces";
import { IRulingSyncService } from "../interfaces";
import { BaseSyncService } from "./base-sync.service";


@injectable()
export class RulingSyncService extends BaseSyncService implements IRulingSyncService{

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
    console.log("start RulingSyncService.sync");
    if (progressCallback) {
      progressCallback("sync rulings");
    }
    return Rulings.byId(options.cardId)
      .then((scryFall: Array<ScryfallRuling>) => this.processSync(scryFall));
  }

  private async processSync(rulings: Array<ScryfallRuling>): Promise<void> {
    console.log("Start RulingRepository.Sync");
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

    return this.database.transaction().execute(async (trx: Transaction<DatabaseSchema>) => {
      for (const oracleId of groupByOracleid.keys()) {
        await this.syncRulingForSingleOracleId(trx, oracleId, groupByOracleid.get(oracleId));
      }
    });
  }

  private async syncRulingForSingleOracleId(trx: Transaction<DatabaseSchema>, oracleId: string, rulings: Array<ScryfallRuling>): Promise<InsertResult> {
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

    return deleteLinesPromise.then(() => {
      const allRulingLines = rulings.map((ruling: ScryfallRuling) => this.rulingLineAdapter.toInsert(oracleId, ruling));
      return trx
        .insertInto("ruling_line")
        .values(allRulingLines)
        .executeTakeFirstOrThrow();
    });
  }
}
