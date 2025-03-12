import * as fs from "fs";
import { DeleteResult, InsertResult, Transaction, Updateable } from "kysely";
import * as helpers from "kysely/helpers/sqlite";
import { inject, injectable } from "tsyringe";
import { IColorDto, IDeckCardListDto, IDeckDetailsDto, IDeckDto, IDeckFolderDto, IDeckListDto, IUpdateDeckCardQuantityDto } from "../../../../common/dto";
import { sqliteUTCTimeStamp } from "../../../../common/util";
import { IResult } from "../../../services/base";
import { IDatabaseService, ILogService, IResultFactory } from "../../../services/infra/interfaces";
import { INFRASTRUCTURE } from "../../../services/service.tokens";
import { logCompilable } from "../../log-compilable";
import { CARD_TABLE_FIELDS, DatabaseSchema } from "../../schema";
import { DeckTable } from "../../schema/deck/deck.table";
import { DECK_TABLE_FIELDS } from "../../schema/deck/table-field.constants";
import { IDeckRepository } from "../interfaces";
import { BaseRepository } from "./base.repository";
import { $cardColors, $cardFaces, $deckSize, $oracle, $sideboardSize } from "./helpers";
import { $whereBoolean } from "./helpers/boolean-helpers";


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
  public createDeck(deck: IDeckDto): Promise<IResult<IDeckDto>> {
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
              .$castTo<IDeckListDto>()
              // .$call((q) => logCompilable(this.logService, q))
              .executeTakeFirstOrThrow())
            .then((r: IDeckListDto) => {
              r.deckSize = 0;
              r.sideboardSize = 0;
              return this.resultFactory.createSuccessResult<IDeckDto>(r);
            });
        });
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<IDeckDto>(err);
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

  public deleteDeckCard(id: number): Promise<IResult<number>> {
    try {
      return this.database.transaction()
        .execute(async (trx: Transaction<DatabaseSchema>) => {
          return trx
            .deleteFrom("deck_card")
            .where("deck_card.id", "=", id)
            .executeTakeFirstOrThrow()
            .then((r: DeleteResult) => {
              if (r.numDeletedRows > 0) {
                return this.resultFactory.createSuccessResult<number>(Number(r.numDeletedRows));
              } else {
                return this.resultFactory.createNotFoundResult(`Deckcard with id '${id}'`);
              }
            });
        });
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<number>(err);
    }
  }

  public getAllCardsOfDeck(deckId: number): Promise<IResult<Array<IDeckCardListDto>>> {
    try {
      return this.database
        .selectFrom("deck_card")
        .innerJoin("card", "card.id", "deck_card.card_id")
        .select((eb) => [
          ...CARD_TABLE_FIELDS,
          "deck_card.deck_quantity",
          "deck_card.sideboard_quantity",
          "deck_card.id as deck_card_id",
          $cardFaces(eb.ref("card.id")).as("cardfaces"),
          $oracle(eb.ref("card.oracle_id")).as("oracle"),
          $cardColors(eb.ref("card.id")).as("cardColors")
        ])
        .where("deck_card.deck_id", "=", deckId)
        .$castTo<IDeckCardListDto>()
        .execute()
        .then((qryResult: Array<IDeckCardListDto>) => {
          fs.writeFileSync("c:/data/new-assistant/json/getcardsofdeck.json", JSON.stringify(qryResult, null, 2));
          return this.resultFactory.createSuccessResult<Array<IDeckCardListDto>>(qryResult);
        });
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<Array<IDeckCardListDto>>(err);
    }
  }

  public getAllDecksInFolder(folderId: number): Promise<IResult<Array<IDeckListDto>>> {
    try {
      return this.database
        .selectFrom("deck")
        .select((eb) => [
          ...DECK_TABLE_FIELDS,
          $deckSize(eb.ref("deck.id")).as("deckSize"),
          $sideboardSize(eb.ref("deck.id")).as("sideboardSize"),
          helpers.jsonArrayFrom(
            eb.selectFrom("deck_card")
              .innerJoin("card", "card.id", "deck_card.card_id")
              .leftJoin("card_color_map", "card_color_map.card_id", "deck_card.card_id")
              .innerJoin("color", "color.id", "card_color_map.color_id")
              .select(["color.mana_symbol", "color.sequence"])
              .distinct()
              .$castTo<Pick<IColorDto, "sequence" | "mana_symbol">>()
              .whereRef("deck_card.deck_id", "=", "deck.id")
              .where("card_color_map.color_type", "=", "identity")
          ).as("accumulatedColorIdentity")
        ])
        .where("deck.parent_id", "=", folderId)
        .where((eb) => $whereBoolean(eb.ref("deck.is_folder"), false))
        .$call((sqb) => logCompilable(this.logService, sqb))
        .$castTo<IDeckListDto>()
        .execute()
        .then((qryResult: Array<IDeckListDto>) => {
          fs.writeFileSync("c:/data/new-assistant/json/getAllDecks.json", JSON.stringify(qryResult, null, 2));
          return this.resultFactory.createSuccessResult<Array<IDeckListDto>>(qryResult);
        });
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<Array<IDeckListDto>>(err);
    }
  }

  public getAllFolders(): Promise<IResult<Array<IDeckFolderDto>>> {
    try {
      return this.database
        .selectFrom("deck")
        .selectAll()
        .where((eb) => $whereBoolean(eb.ref("deck.is_folder"), true))
        .$castTo<IDeckFolderDto>()
        .execute()
        .then((qryResult: Array<IDeckFolderDto>) => this.resultFactory.createSuccessResult(qryResult));
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<Array<IDeckFolderDto>>(err);
    }
  }

  public getDeckDetails(id: number): Promise<IResult<IDeckDetailsDto>> {
    try {
      return this.database
        .selectFrom("deck")
        .selectAll()
        .where("deck.id", "=", id)
        .$castTo<IDeckDetailsDto>()
        .executeTakeFirst()
        .then((dto: IDeckDetailsDto) => {
          if (dto) {
            return this.resultFactory.createSuccessResult<IDeckDetailsDto>(dto);
          } else {
            return this.resultFactory.createNotFoundResult<IDeckListDto>(`Deck with ID '${id}'`);
          }
        });
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<IDeckDetailsDto>(err);
    }
  }

  public patchDeck(deck: Partial<IDeckDto>): Promise<IResult<IDeckDto>> {
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
              .$castTo<IDeckDto>()
              // .$call((q) => logCompilable(this.logService, q))
              .executeTakeFirst())
            .then((r: IDeckDto) => this.resultFactory.createSuccessResult<IDeckDto>(r));
        });
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<IDeckDto>(err);
    }
  }

  public updateDeckCardQuantity(deckCard: IUpdateDeckCardQuantityDto): Promise<IResult<IDeckCardListDto>> {
    try {
      return this.database.transaction()
        .execute(async (trx: Transaction<DatabaseSchema>) => {
          return trx.updateTable("deck_card")
            .set({
              deck_quantity: deckCard.deck_quantity,
              sideboard_quantity: deckCard.sideboard_quantity,
              modified_at: sqliteUTCTimeStamp()
            })
            .where("deck_card.id", "=", deckCard.deck_card_id)
            .executeTakeFirstOrThrow()
            .then(() => trx.selectFrom("deck_card")
              .innerJoin("card", "card.id", "deck_card.card_id")
              .select((eb) => [
                ...CARD_TABLE_FIELDS,
                "deck_card.deck_quantity",
                "deck_card.sideboard_quantity",
                "deck_card.id as deck_card_id",
                $cardFaces(eb.ref("card.id")).as("cardfaces"),
                $oracle(eb.ref("card.oracle_id")).as("oracle"),
                $cardColors(eb.ref("card.id")).as("cardColors")
              ])
              .where("deck_card.id", "=", deckCard.deck_card_id)
              .$castTo<IDeckCardListDto>()
              .executeTakeFirst()
              .then((qryResult: IDeckCardListDto) => {
                fs.writeFileSync("c:/data/new-assistant/json/updateDeckCardQuantity.json", JSON.stringify(qryResult, null, 2));
                return this.resultFactory.createSuccessResult<IDeckCardListDto>(qryResult);
              })
            );
        });
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<IDeckCardListDto>(err);
    }
  }
  //#endregion
}
