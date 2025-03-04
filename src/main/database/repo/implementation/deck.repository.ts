import * as fs from "fs";
import { DeleteResult, Insertable, InsertResult, sql, Transaction } from "kysely";
import * as helpers from "kysely/helpers/sqlite";
import { inject, injectable } from "tsyringe";
import { DeckListDto } from "../../../../common/dto";
import { DeckLegalityDto } from "../../../../common/dto/deck/deck-legalitydto.";
import { sqliteUTCTimeStamp } from "../../../../common/util";
import { IResult } from "../../../services/base";
import { IDatabaseService, ILogService, IResultFactory } from "../../../services/infra/interfaces";
import { INFRASTRUCTURE } from "../../../services/service.tokens";
import { logCompilable } from "../../log-compilable";
import { DatabaseSchema } from "../../schema";
import { DeckTable } from "../../schema/deck/deck.table";
import { DECK_TABLE_FIELDS } from "../../schema/deck/table-field.constants";
import { IDeckRepository } from "../interfaces";
import { BaseRepository } from "./base.repository";

@injectable()
export class DeckRepository extends BaseRepository implements IDeckRepository {
  //#region Constructor & C° --------------------------------------------------
  public constructor(
    @inject(INFRASTRUCTURE.DatabaseService) databaseService: IDatabaseService,
    @inject(INFRASTRUCTURE.LogService) logService: ILogService,
    @inject(INFRASTRUCTURE.ResultFacotry) resultFactory: IResultFactory
  ) {
    super(databaseService, logService, resultFactory);
  }
  //#region

  //#region IDeckRepository methods ------------------------------------------
  /* eslint-disable @stylistic/function-paren-newline */
  public createDeck(deck: DeckListDto): Promise<IResult<DeckListDto>> {
    try {
      const now = sqliteUTCTimeStamp();
      return this.database.transaction()
        .execute(async (trx: Transaction<DatabaseSchema>) => {
          return trx
            .insertInto("deck")
            .values({
              name: deck.name,
              description: deck.description,
              target_format: deck.target_format,
              created_at: now,
              modified_at: now
            })
            // .$call((q) => logCompilable(this.logService, q))
            .executeTakeFirstOrThrow()
            .then((r: InsertResult) => trx.selectFrom("deck")
              .selectAll()
              .where("deck.id", "=", Number(r.insertId))
              .$castTo<DeckListDto>()
              // .$call((q) => logCompilable(this.logService, q))
              .executeTakeFirst())
            .then((r: DeckListDto) => {
              r.deckSize = 0;
              r.sideBoardSize = 0;
              r.calculatedFormats = new Array<DeckLegalityDto>();
              return this.resultFactory.createSuccessResult<DeckListDto>(r);
            });
        });
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<DeckListDto>(err);
    }
  }

  public deleteDeck(id: number): Promise<IResult<number>> {
    try {
      return this.database.transaction()
        .execute(async (trx: Transaction<DatabaseSchema>) => {
          return trx
            .deleteFrom("deck")
            .where("deck.id", "=", id)
            .executeTakeFirstOrThrow()
            .then((r: DeleteResult) => {
              if (r.numDeletedRows > 0) {
                return this.resultFactory.createSuccessResult<number>(Number(r.numDeletedRows));
              } else {
                return this.resultFactory.createNotFoundResult(`Deck with id '${id}'`);
              }
            });
        });
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<number>(err);
    }
  }

  public getAll(): Promise<IResult<Array<DeckListDto>>> {
    try {
      return this.database
        .selectFrom("deck")
        // NOW check if we can create helper functions for this
        .select((eb) => [
          ...DECK_TABLE_FIELDS,
          eb.fn
            .coalesce(
              eb.selectFrom("deck_card as dcd")
                .select((eb) => [eb.fn.sum<number>("dcd.deck_quantity").as("deckSize")])
                .whereRef("dcd.deck_id", "=", "deck.id")
                .$castTo<number>(),
              sql<number>`0`)
            .as("deckSize"),
          eb.fn
            .coalesce(
              eb.selectFrom("deck_card as dcd")
                .select((eb) => [eb.fn.sum<number>("dcd.side_board_quantity").as("sideBoardSize")])
                .whereRef("dcd.deck_id", "=", "deck.id")
                .$castTo<number>(),
              sql<number>`0`)
            .as("sideBoardSize"),
          // NOW this logic is not correct - in order to solve it we should be able to sort legality (store in the db ?)
          // moreover we should check that restricted cards only are once in the deck
          helpers.jsonArrayFrom(
            eb.selectFrom("deck_card")
              .innerJoin("card", "card.id", "deck_card.card_id")
              .innerJoin("oracle_legality", "oracle_legality.oracle_id", "card.oracle_id")
              .select(["oracle_legality.format", "oracle_legality.legality"])
              .distinct()
              .$castTo<DeckLegalityDto>()
              .whereRef("deck_card.deck_id", "=", "deck.id")
              .where("oracle_legality.legality", "in", ["legal", "restricted"])
          ).as("calculatedFormats")
        ])
        .$call((sqb) => logCompilable(this.logService, sqb))
        .$castTo<DeckListDto>()
        .execute()
        .then((qryResult: Array<DeckListDto>) => {
          fs.writeFileSync("c:/data/new-assistant/json/getAllDecks.json", JSON.stringify(qryResult, null, 2));
          return this.resultFactory.createSuccessResult<Array<DeckListDto>>(qryResult);
        });
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<Array<DeckListDto>>(err);
    }
  }

  public patchDeck(deck: Partial<DeckListDto>): Promise<IResult<DeckListDto>> {
    try {
      const toUpdate: Insertable<DeckTable> = {
        modified_at: sqliteUTCTimeStamp(),
        name: deck?.name,
        description: deck?.description,
        target_format: deck?.target_format
      };

      return this.database.transaction()
        .execute(async (trx: Transaction<DatabaseSchema>) => {
          return trx.updateTable("deck")
            .set(toUpdate)
            .where("deck.id", "=", deck.id)
            .executeTakeFirstOrThrow()
            .then(() => trx.selectFrom("deck")
              .select((eb) => [
                ...DECK_TABLE_FIELDS,
                eb.fn
                  .coalesce(
                    eb.selectFrom("deck_card as dcd")
                      .select((eb) => [eb.fn.sum<number>("dcd.deck_quantity").as("deckSize")])
                      .whereRef("dcd.deck_id", "=", "deck.id")
                      .$castTo<number>(),
                    sql<number>`0`)
                  .as("deckSize"),
                eb.fn
                  .coalesce(
                    eb.selectFrom("deck_card as dcd")
                      .select((eb) => [eb.fn.sum<number>("dcd.side_board_quantity").as("sideBoardSize")])
                      .whereRef("dcd.deck_id", "=", "deck.id")
                      .$castTo<number>(),
                    sql<number>`0`)
                  .as("sideBoardSize"),
                // NOW this logic is not correct - in order to solve it we should be able to sort legality (store in the db ?)
                helpers.jsonArrayFrom(
                  eb.selectFrom("deck_card")
                    .innerJoin("card", "card.id", "deck_card.card_id")
                    .innerJoin("oracle_legality", "oracle_legality.oracle_id", "card.oracle_id")
                    .select(["oracle_legality.format", "oracle_legality.legality"])
                    .distinct()
                    .$castTo<DeckLegalityDto>()
                    .whereRef("deck_card.deck_id", "=", "deck.id")
                    .where("oracle_legality.legality", "in", ["legal", "restricted"])
                ).as("calculatedFormats")
              ])
              .where("deck.id", "=", Number(deck.id))
              .$castTo<DeckListDto>()
              // .$call((q) => logCompilable(this.logService, q))
              .executeTakeFirst())
            .then((r: DeckListDto) => this.resultFactory.createSuccessResult<DeckListDto>(r));
        });
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<DeckListDto>(err);
    }
  }
  //#endregion
}
