import { DeleteResult, ExpressionOrFactory, InsertResult, Selectable, SqlBool, Transaction, UpdateResult } from "kysely";
import { inject, injectable } from "tsyringe";

import { ProgressCallback, RulingSyncOptions } from "../../../../../common/ipc-params";
import { CardTable, DatabaseSchema } from "../../../../database/schema";
import INFRATOKENS, { IDatabaseService } from "../../../infra/interfaces";
import ADAPTTOKENS, { IOracleRulingAdapter, IOracleRulingLineAdapter } from "../../adapt/interface";
import CLIENTTOKENS, { IScryfallClient } from "../../client/interfaces";
import { ScryfallRuling } from "../../types";
import { IRulingSyncService } from "../interface";
import { BaseSyncService } from "./base-sync.service";
import { DtoSyncParam } from "../../../../../common/dto";

@injectable()
export class RulingSyncService extends BaseSyncService<RulingSyncOptions> implements IRulingSyncService {

  //#region private readonly fields -------------------------------------------
  private readonly scryfallclient: IScryfallClient;
  private readonly rulingLineAdapter: IOracleRulingLineAdapter;
  private readonly rulingAdapter: IOracleRulingAdapter;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(
    @inject(INFRATOKENS.DatabaseService) databaseService: IDatabaseService,
    @inject(CLIENTTOKENS.ScryfallClient) scryfallclient: IScryfallClient,
    @inject(ADAPTTOKENS.OracleRulingLineAdapter) rulingLineAdapter: IOracleRulingLineAdapter,
    @inject(ADAPTTOKENS.OracleRulingAdapter) rulingAdapter: IOracleRulingAdapter) {
    super(databaseService);
    this.scryfallclient = scryfallclient;
    this.rulingLineAdapter = rulingLineAdapter;
    this.rulingAdapter = rulingAdapter;
  }

  public override async newSync(syncParam: DtoSyncParam, progressCallback: ProgressCallback): Promise<void> {
    throw new Error("Not implemented");
  }

  public override async sync(options: RulingSyncOptions, progressCallback: ProgressCallback): Promise<void> {
    if (progressCallback) {
      progressCallback("Synchronizing rulings");
    }
    return this.scryfallclient.getRulings(options.cardId)
      .then((scryFall: Array<ScryfallRuling>) => this.processSync(options.cardId, scryFall));
  }

  private async processSync(cardId: string, rulings: Array<ScryfallRuling>): Promise<void> {
    if (rulings.length > 0) {
      const groupByOracleid: Map<string, Array<ScryfallRuling>> = new Map<string, Array<ScryfallRuling>>();
      rulings.forEach((ruling: ScryfallRuling) => {
        if (groupByOracleid.has(ruling.oracle_id)) {
          groupByOracleid.get(ruling.oracle_id).push(ruling);
        } else {
          groupByOracleid.set(ruling.oracle_id, new Array<ScryfallRuling>(ruling));
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
          .then((card: Selectable<CardTable>) => this.syncRulingForSingleOracleId(trx, card.oracle_id, new Array<ScryfallRuling>()));
      });
    }
  }

  private async syncRulingForSingleOracleId(trx: Transaction<DatabaseSchema>, oracleId: string, rulings: Array<ScryfallRuling>): Promise<InsertResult | void> {

    const rulingFilter: ExpressionOrFactory<DatabaseSchema, "oracle_ruling", SqlBool> = (eb) => eb("oracle_ruling.oracle_id", "=", oracleId);
    const existingRulingPromise = trx
      .selectFrom("oracle_ruling")
      .select("oracle_ruling.oracle_id")
      .where(rulingFilter)
      .executeTakeFirst();

    const insertOrUpdateRulingPromise = existingRulingPromise.then((queryResult) => {
      let insertedOrUpdatedRuling: Promise<InsertResult | UpdateResult>;
      if (queryResult) {
        insertedOrUpdatedRuling = trx.updateTable("oracle_ruling")
          .set(this.rulingAdapter.toUpdate(null))
          .where(rulingFilter)
          .executeTakeFirstOrThrow();
      } else {
        insertedOrUpdatedRuling = trx.insertInto("oracle_ruling")
          .values(this.rulingAdapter.toInsert(oracleId))
          .executeTakeFirstOrThrow();
      }
      return insertedOrUpdatedRuling;
    });

    const deleteLinesPromise: Promise<Array<DeleteResult>> = insertOrUpdateRulingPromise.then(() => {
      const rulingLineFilter: ExpressionOrFactory<DatabaseSchema, "oracle_ruling_line", SqlBool> = (eb) => eb("oracle_ruling_line.oracle_id", "=", oracleId);
      return trx.deleteFrom("oracle_ruling_line").where(rulingLineFilter).execute();
    });

    if (rulings.length > 0) {
      return deleteLinesPromise.then(() => {
        const allRulingLines = rulings.map((ruling: ScryfallRuling) => this.rulingLineAdapter.toInsert(ruling));
        return trx
          .insertInto("oracle_ruling_line")
          .values(allRulingLines)
          .executeTakeFirstOrThrow();
      });
    } else {
      return Promise.resolve();
    }
  }
}
