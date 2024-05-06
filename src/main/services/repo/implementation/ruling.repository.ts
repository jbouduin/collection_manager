import { DeleteResult, ExpressionOrFactory, InsertResult, SqlBool, Transaction, UpdateResult } from "kysely";
import { Ruling as ScryfallRuling } from "scryfall-sdk";
import { inject, injectable } from "tsyringe";

import { RulingsByCardIdSelectDto } from "../../../../common/dto";
import { DatabaseSchema } from "../../../../main/database/schema";
import ADAPTTOKENS, { IRulingAdapter, IRulingLineAdapter } from "../../adapt/interfaces";
import INFRATOKENS, { IDatabaseService } from "../../infra/interfaces";
import { IRulingRepository } from "../interfaces";
import { BaseRepository } from "./base.repository";

@injectable()
export class RulingRepository extends BaseRepository implements IRulingRepository {

  private rulingLineAdapter: IRulingLineAdapter;
  private rulingAdapter: IRulingAdapter;

  public constructor(
    @inject(INFRATOKENS.DatabaseService) databaseService: IDatabaseService,
    @inject(ADAPTTOKENS.RulingLineAdapter) rulingLineAdapter: IRulingLineAdapter,
    @inject(ADAPTTOKENS.RulingAdapter) rulingAdapter: IRulingAdapter
  ) {
    super(databaseService);
    this.rulingLineAdapter = rulingLineAdapter;
    this.rulingAdapter = rulingAdapter;
  }

  public async getByCardId(cardId: string): Promise<RulingsByCardIdSelectDto> {
    console.log("Start RulingRepository.getByCardId");
    return this.database
      .selectFrom("card")
      .rightJoin("ruling", "ruling.oracle_id", "card.oracle_id")
      .rightJoin("ruling_line", "ruling_line.oracle_id", "ruling.oracle_id")
      .where("card.id", "=", cardId)
      .selectAll("ruling_line")
      .execute();
  }

  public async sync(rulings: Array<ScryfallRuling>): Promise<void> {
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
