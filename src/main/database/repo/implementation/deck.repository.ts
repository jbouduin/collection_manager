import * as fs from "fs";
import { DeleteResult, InsertResult, sql, Transaction, Updateable } from "kysely";
import * as helpers from "kysely/helpers/sqlite";
import { inject, injectable } from "tsyringe";
import { ColorDto, DeckDetailsDto, DeckDto, DeckFolderDto, DeckListDto } from "../../../../common/dto";
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
  public createDeck(deck: DeckDto): Promise<IResult<DeckDto>> {
    try {
      const now = sqliteUTCTimeStamp();
      return this.database.transaction()
        .execute(async (trx: Transaction<DatabaseSchema>) => {
          return trx
            .insertInto("deck")
            .values({
              parent_id: deck.parent_id,
              name: deck.name,
              description: deck.description,
              target_format: deck.target_format,
              created_at: now,
              is_system: deck.is_system ? 1 : 0,
              is_folder: deck.is_folder ? 1 : 0,
              modified_at: null
            })
            // .$call((q) => logCompilable(this.logService, q))
            .executeTakeFirstOrThrow()
            .then((r: InsertResult) => trx.selectFrom("deck")
              .selectAll()
              .where("deck.id", "=", Number(r.insertId))
              .$castTo<DeckListDto>()
              // .$call((q) => logCompilable(this.logService, q))
              .executeTakeFirstOrThrow())
            .then((r: DeckListDto) => {
              r.deckSize = 0;
              r.sideBoardSize = 0;
              r.calculatedFormats = new Array<DeckLegalityDto>();
              return this.resultFactory.createSuccessResult<DeckDto>(r);
            });
        });
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<DeckDto>(err);
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

  public getAllFolders(): Promise<IResult<Array<DeckFolderDto>>> {
    try {
      return this.database
        .selectFrom("deck")
        .selectAll()
        // NOW create a helper for this
        .where(sql`deck.is_folder`, "=", sql`1`)
        .$castTo<DeckFolderDto>()
        .execute()
        .then((qryResult: Array<DeckFolderDto>) => this.resultFactory.createSuccessResult(qryResult));
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<Array<DeckFolderDto>>(err);
    }
  }

  public getAllDecksInFolder(folderId: number): Promise<IResult<Array<DeckListDto>>> {
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
          /*
           * NOW this logic is not correct - in order to solve it we should be able to sort legality (store in the db ?) and game format
           * moreover we should check:
           * - that restricted cards only are once in the deck
           * - the number of cards is legal
           * - all cards in a commander deck should have one shared color identity
           */
          helpers.jsonArrayFrom(
            eb.selectFrom("deck_card")
              .innerJoin("card", "card.id", "deck_card.card_id")
              .innerJoin("oracle_legality", "oracle_legality.oracle_id", "card.oracle_id")
              .select(["oracle_legality.format", "oracle_legality.legality"])
              .distinct()
              .$castTo<DeckLegalityDto>()
              .whereRef("deck_card.deck_id", "=", "deck.id")
              .where("oracle_legality.legality", "in", ["legal", "restricted"])
          ).as("calculatedFormats"),
          helpers.jsonArrayFrom(
            eb.selectFrom("deck_card")
              .innerJoin("card", "card.id", "deck_card.card_id")
              .leftJoin("card_color_map", "card_color_map.card_id", "deck_card.card_id")
              .innerJoin("color", "color.id", "card_color_map.color_id")
              .select(["color.mana_symbol", "color.sequence"])
              .distinct()
              // NOW check to do similar in card repository
              .$castTo<Pick<ColorDto, "sequence" | "mana_symbol">>()
              .whereRef("deck_card.deck_id", "=", "deck.id")
              .where("card_color_map.color_type", "=", "identity")
          ).as("accumulatedColorIdentity")
        ])
        .where("deck.parent_id", "=", folderId)
        // NOW create a helper for this
        .where(sql`deck.is_folder`, "=", sql`0`)
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

  public getDeckDetails(id: number): Promise<IResult<DeckDetailsDto>> {
    try {
      return this.database
        .selectFrom("deck")
        .selectAll()
        .where("deck.id", "=", id)
        .$castTo<DeckDetailsDto>()
        .executeTakeFirst()
        .then((dto: DeckDetailsDto) => {
          if (dto) {
            return this.resultFactory.createSuccessResult<DeckDetailsDto>(dto);
          } else {
            return this.resultFactory.createNotFoundResult<DeckListDto>(`Deck with ID '${id}'`);
          }
        });
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<DeckDetailsDto>(err);
    }
  }

  public patchDeck(deck: Partial<DeckDto>): Promise<IResult<DeckDto>> {
    try {
      const toUpdate: Updateable<DeckTable> = { modified_at: sqliteUTCTimeStamp() };
      if (Object.keys(deck).includes("name")) {
        toUpdate.name = deck.name;
      }
      if (Object.keys(deck).includes("description")) {
        toUpdate.description = deck.description;
      }
      if (Object.keys(deck).includes("target_format")) {
        toUpdate.target_format = deck.target_format;
      }

      return this.database.transaction()
        .execute(async (trx: Transaction<DatabaseSchema>) => {
          return trx.updateTable("deck")
            .set(toUpdate)
            .where("deck.id", "=", deck.id)
            .executeTakeFirstOrThrow()
            .then(() => trx.selectFrom("deck")
              .selectAll()
              .where("deck.id", "=", Number(deck.id))
              .$castTo<DeckDto>()
              // .$call((q) => logCompilable(this.logService, q))
              .executeTakeFirst())
            .then((r: DeckDto) => this.resultFactory.createSuccessResult<DeckDto>(r));
        });
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<DeckDto>(err);
    }
  }
  //#endregion
}
