import { writeFileSync } from "fs";
import { DeleteResult, InsertResult, Transaction, UpdateResult } from "kysely";
import * as helpers from "kysely/helpers/sqlite";
import { inject, injectable } from "tsyringe";
import { CardfaceColorDto, CollectionDto, IdSelectResult, MtgCardColorDto, MtgCardfaceDto, OracleDto, OwnedCardCollectionMapDto, OwnedCardDto, OwnedCardListDto, OwnedCardQuantityDto } from "../../../../common/dto";
import { sqliteUTCTimeStamp } from "../../../../common/util";
import { IResult } from "../../../services/base";
import { IDatabaseService, ILogService, IResultFactory } from "../../../services/infra/interfaces";
import { INFRASTRUCTURE } from "../../../services/service.tokens";
import { logCompilable } from "../../log-compilable";
import { CARD_COLOR_MAP_TABLE_FIELDS, CARD_TABLE_FIELDS, CARDFACE_COLOR_MAP_TABLE_FIELDS, CARDFACE_TABLE_FIELDS, DatabaseSchema } from "../../schema";
import { OWNED_CARD_COLLECTION_MAP_TABLE_FIELDS, OWNED_CARD_TABLE_FIELDS } from "../../schema/collection/table-field.constants";
import { ORACLE_TABLE_FIELDS } from "../../schema/oracle/table-field.constants";
import { ICollectionRepository } from "../interfaces/collection.repository";
import { BaseRepository } from "./base.repository";

@injectable()
export class CollectionRepository extends BaseRepository implements ICollectionRepository {
  //#region Constructor -------------------------------------------------------
  public constructor(
    @inject(INFRASTRUCTURE.DatabaseService) databaseService: IDatabaseService,
    @inject(INFRASTRUCTURE.LogService) logService: ILogService,
    @inject(INFRASTRUCTURE.ResultFacotry) resultFactory: IResultFactory
  ) {
    super(databaseService, logService, resultFactory);
  }
  //#endregion

  //#region ICollectionRepository methods -------------------------------------
  /* eslint-disable @stylistic/function-paren-newline */
  public getAll(): Promise<IResult<Array<CollectionDto>>> {
    try {
      return this.database.selectFrom("collection")
        .selectAll()
        .$castTo<CollectionDto>()
        .execute()
        .then((qryResult: Array<CollectionDto>) => this.resultFactory.createSuccessResult<Array<CollectionDto>>(qryResult));
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<Array<CollectionDto>>(err);
    }
  }

  public getCardQuantitiesForCardInCollection(cardId: string, collectionId: number): Promise<IResult<Array<OwnedCardQuantityDto>>> {
    try {
      return this.database.selectFrom("owned_card")
        .select((eb) => [
          ...OWNED_CARD_TABLE_FIELDS,
          helpers.jsonArrayFrom<OwnedCardCollectionMapDto>(
            eb.selectFrom("owned_card_collection_map")
              .select([...OWNED_CARD_COLLECTION_MAP_TABLE_FIELDS])
              .whereRef("owned_card_collection_map.owned_card_id", "=", "owned_card.id")
              .where("owned_card_collection_map.collection_id", "=", collectionId)
              .$castTo<OwnedCardCollectionMapDto>()
          )
            .as("collectionMaps")
        ])
        .innerJoin("owned_card_collection_map as occm", "occm.owned_card_id", "owned_card.id")
        .where("owned_card.card_id", "=", cardId)
        .where("occm.collection_id", "=", collectionId)
        .$castTo<OwnedCardQuantityDto>()
        // .$call((q) => logCompilable(this.logService, q))
        .execute()
        .then((qryResult: Array<OwnedCardQuantityDto>) => {
          writeFileSync("c:/data/new-assistant/json/getCardQuantitiesForCardInCollection.json", JSON.stringify(qryResult, null, 2));
          return this.resultFactory.createSuccessResult<Array<OwnedCardQuantityDto>>(qryResult);
        });
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<Array<OwnedCardQuantityDto>>(err);
    }
  }

  public getCardQuantitiesForCard(cardId: string): Promise<IResult<Array<OwnedCardQuantityDto>>> {
    try {
      return this.database.selectFrom("owned_card")
        .select((eb) => [
          ...OWNED_CARD_TABLE_FIELDS,
          helpers.jsonArrayFrom<OwnedCardCollectionMapDto>(
            eb.selectFrom("owned_card_collection_map")
              .select([...OWNED_CARD_COLLECTION_MAP_TABLE_FIELDS])
              .whereRef("owned_card_collection_map.owned_card_id", "=", "owned_card.id")
              .$castTo<OwnedCardCollectionMapDto>()
          )
            .as("collectionMaps")
        ])
        .innerJoin("owned_card_collection_map as occm", "occm.owned_card_id", "owned_card.id")
        .where("owned_card.card_id", "=", cardId)
        .$call((q) => logCompilable(this.logService, q))
        .$castTo<OwnedCardQuantityDto>()
        .execute()
        .then((qryResult: Array<OwnedCardQuantityDto>) => {
          writeFileSync("c:/data/new-assistant/json/getCardQuantitiesForCard.json", JSON.stringify(qryResult, null, 2));
          return this.resultFactory.createSuccessResult<Array<OwnedCardQuantityDto>>(qryResult);
        });
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<Array<OwnedCardQuantityDto>>(err);
    }
  }

  public getCollectionCardList(id: number): Promise<IResult<Array<OwnedCardListDto>>> {
    try {
      return this.database.selectFrom("card")
        .select((eb) => [
          ...CARD_TABLE_FIELDS,
          helpers.jsonArrayFrom<MtgCardfaceDto>(
            eb.selectFrom("cardface")
              .select((eb) => [
                ...CARDFACE_TABLE_FIELDS,
                helpers.jsonArrayFrom<CardfaceColorDto>(
                  eb.selectFrom("cardface_color_map")
                    .select(CARDFACE_COLOR_MAP_TABLE_FIELDS)
                    .whereRef("cardface_color_map.card_id", "=", "cardface.card_id")
                    .whereRef("cardface_color_map.sequence", "=", "cardface.sequence")
                    .$castTo<CardfaceColorDto>()
                ).as("cardfaceColors"),
                helpers.jsonObjectFrom<OracleDto>(
                  eb.selectFrom("oracle")
                    .select(ORACLE_TABLE_FIELDS)
                    .whereRef("oracle.oracle_id", "=", "cardface.oracle_id")
                    .$castTo<OracleDto>()
                ).as("oracle")
              ])
              .whereRef("cardface.card_id", "=", "card.id")
              .$castTo<MtgCardfaceDto>()
          ).as("cardfaces"),
          helpers.jsonArrayFrom<OracleDto>(
            eb.selectFrom("oracle")
              .select(ORACLE_TABLE_FIELDS)
              .whereRef("oracle.oracle_id", "=", "card.oracle_id")
              .$castTo<OracleDto>()
          ).as("oracle"),
          helpers.jsonArrayFrom<OwnedCardDto>(
            eb.selectFrom("owned_card")
              .select((eb) => [
                ...OWNED_CARD_TABLE_FIELDS,
                eb.selectFrom("owned_card_collection_map as occm")
                  .select("occm.quantity")
                  .whereRef("occm.owned_card_id", "=", "owned_card.id")
                  .where("occm.collection_id", "=", id)
                  .$castTo<number>()
                  .as("quantity")
              ])
              .whereRef("owned_card.card_id", "=", "card.id")
              .$castTo<OwnedCardDto>()
          ).as("ownedCards"),
          helpers.jsonArrayFrom<MtgCardColorDto>(
            eb.selectFrom("card_color_map")
              .innerJoin("color", "color.id", "card_color_map.color_id")
              .select([...CARD_COLOR_MAP_TABLE_FIELDS, "color.mana_symbol"])
              .whereRef("card_color_map.card_id", "=", "card.id")
              .$castTo<MtgCardColorDto>()
          ).as("cardColors")
        ])
        .innerJoin("owned_card", "owned_card.card_id", "card.id")
        .innerJoin("owned_card_collection_map", "owned_card_collection_map.owned_card_id", "owned_card.id")
        .where("owned_card_collection_map.collection_id", "=", id)
        .groupBy(["card.id"])
        .$call((q) => logCompilable(this.logService, q))
        .$castTo<OwnedCardListDto>()
        .execute()
        .then((qryResult: Array<OwnedCardListDto>) => {
          writeFileSync("c:/data/new-assistant/json/getCollectionCardList.json", JSON.stringify(qryResult, null, 2));
          return this.resultFactory.createSuccessResult(qryResult);
        });
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<Array<OwnedCardListDto>>(err);
    }
  }

  public create(collection: CollectionDto): Promise<IResult<CollectionDto>> {
    try {
      const now = sqliteUTCTimeStamp();
      return this.database.transaction()
        .execute(async (trx: Transaction<DatabaseSchema>) => {
          return trx
            .insertInto("collection")
            .values({
              name: collection.name,
              description: collection.description,
              is_folder: collection.is_folder ? 1 : 0,
              is_system: collection.is_system ? 1 : 0,
              created_at: now,
              modified_at: now,
              parent_id: collection.parent_id
            })
            .$call((q) => logCompilable(this.logService, q))
            .executeTakeFirstOrThrow()
            .then((r: InsertResult) => trx.selectFrom("collection")
              .selectAll()
              .where("collection.id", "=", Number(r.insertId))
              .$castTo<CollectionDto>()
              // .$call((q) => logCompilable(this.logService, q))
              .executeTakeFirst())
            .then((r: CollectionDto) => this.resultFactory.createSuccessResult<CollectionDto>(r));
        });
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<CollectionDto>(err);
    }
  }

  public delete(id: number): Promise<IResult<number>> {
    try {
      return this.database.transaction()
        .execute(async (trx: Transaction<DatabaseSchema>) => {
          return trx
            .deleteFrom("collection")
            .where("collection.id", "=", id)
            .executeTakeFirstOrThrow()
            .then((r: DeleteResult) => this.resultFactory.createSuccessResult<number>(Number(r.numDeletedRows)));
        });
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<number>(err);
    }
  }

  public async saveQuantitiesForCardInCollection(
    cardId: string,
    collectionId: number,
    quantities: Array<OwnedCardQuantityDto>
  ): Promise<IResult<Array<OwnedCardQuantityDto>>> {
    writeFileSync("c:/data/new-assistant/json/saveQuantities.json", JSON.stringify(quantities, null, 2));
    if (quantities.findIndex((ocq: OwnedCardQuantityDto) => ocq.card_id != cardId) >= 0) {
      return this.resultFactory.createBadRequestResultPromise<Array<OwnedCardQuantityDto>>();
    }
    if (quantities.map((ocq: OwnedCardQuantityDto) => ocq.collectionMaps)
      .flat(1)
      .findIndex((cm: OwnedCardCollectionMapDto) => cm.collection_id != collectionId) >= 0
    ) {
      return this.resultFactory.createBadRequestResultPromise<Array<OwnedCardQuantityDto>>();
    }

    try {
      const now = sqliteUTCTimeStamp();
      return this.database.transaction()
        .execute(async (trx: Transaction<DatabaseSchema>) => {
          // save the new ones
          const newOwnedCardIds = quantities.filter((ocq: OwnedCardQuantityDto) => ocq.id == 0).map((ocq: OwnedCardQuantityDto) => {
            return trx
              .insertInto("owned_card")
              .values({
                card_id: ocq.card_id,
                condition_id: ocq.condition_id,
                created_at: now,
                is_foil: ocq.is_foil ? 1 : 0,
                modified_at: now
              })
              .executeTakeFirstOrThrow()
              .then((r: InsertResult) => trx.selectFrom("owned_card")
                .select("owned_card.id")
                .where("owned_card.id", "=", Number(r.insertId))
                .$castTo<IdSelectResult<number>>()
                .$call((q) => logCompilable(this.logService, q))
                .executeTakeFirst()
                .then((own: IdSelectResult<number>) => {
                  return Promise.all([
                    ...ocq.collectionMaps.map((cm: OwnedCardCollectionMapDto) => trx.insertInto("owned_card_collection_map")
                      .values({
                        collection_id: cm.collection_id,
                        created_at: now,
                        modified_at: now,
                        owned_card_id: own.id,
                        quantity: cm.quantity
                      })
                      .executeTakeFirst())
                  ])
                    .then(() => own.id);
                })
              );
          });
          // update the existing ones
          const existingOwnCardIds = quantities.filter((ocq: OwnedCardQuantityDto) => ocq.id > 0).map((ocqq: OwnedCardQuantityDto) => {
            return trx.updateTable("owned_card")
              .set({ modified_at: now })
              .executeTakeFirstOrThrow()
              .then(async (_r: UpdateResult) => {
                // save the new ones
                const newMaps = ocqq.collectionMaps.filter((cm: OwnedCardCollectionMapDto) => cm.owned_card_id == 0).map((cm: OwnedCardCollectionMapDto) => {
                  return trx.insertInto("owned_card_collection_map")
                    .values({
                      collection_id: cm.collection_id,
                      created_at: now,
                      modified_at: now,
                      owned_card_id: ocqq.id,
                      quantity: cm.quantity
                    })
                    .executeTakeFirstOrThrow()
                    .then((ir: InsertResult) => ir.insertId);
                });
                // update the existing ones
                const existingMaps = ocqq.collectionMaps.filter((cm: OwnedCardCollectionMapDto) => cm.owned_card_id != 0).map((cm: OwnedCardCollectionMapDto) => {
                  return trx.updateTable("owned_card_collection_map")
                    .set({
                      modified_at: now,
                      quantity: cm.quantity
                    })
                    .where("owned_card_collection_map.collection_id", "=", cm.collection_id)
                    .where("owned_card_collection_map.owned_card_id", "=", cm.owned_card_id)
                    .executeTakeFirstOrThrow()
                    .then((ur: UpdateResult) => ur.numUpdatedRows);
                });
                return Promise.all([
                  ...existingMaps,
                  ...newMaps
                ]).then(() => ocqq.id);
              });
          });
          return Promise.all([
            ...newOwnedCardIds,
            ...existingOwnCardIds
          ]).then((mapIds: Array<number>) => trx.selectFrom("owned_card")
            .select((eb) => [
              ...OWNED_CARD_TABLE_FIELDS,
              helpers.jsonArrayFrom<OwnedCardCollectionMapDto>(
                eb.selectFrom("owned_card_collection_map")
                  .select([...OWNED_CARD_COLLECTION_MAP_TABLE_FIELDS])
                  .whereRef("owned_card_collection_map.owned_card_id", "=", "owned_card.id")
                  .where("owned_card_collection_map.collection_id", "=", collectionId)
                  .$castTo<OwnedCardCollectionMapDto>()
              )
                .as("collectionMaps")
            ])
            .innerJoin("owned_card_collection_map as occm", "occm.owned_card_id", "owned_card.id")
            .where("owned_card.id", "in", mapIds)
            .where("occm.collection_id", "=", collectionId)
            .$castTo<OwnedCardQuantityDto>()
            .$call((q) => logCompilable(this.logService, q))
            .execute()
            .then((qryResult: Array<OwnedCardQuantityDto>) => {
              writeFileSync("c:/data/new-assistant/json/savedQuantities.json", JSON.stringify(qryResult, null, 2));
              return this.resultFactory.createSuccessResult<Array<OwnedCardQuantityDto>>(qryResult);
            }
            ));
        });
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<Array<OwnedCardQuantityDto>>(err);
    }
  }

  public update(collection: CollectionDto): Promise<IResult<CollectionDto>> {
    try {
      return this.database.transaction()
        .execute(async (trx: Transaction<DatabaseSchema>) => {
          return trx.updateTable("collection")
            .set({
              name: collection.name,
              description: collection.description,
              modified_at: sqliteUTCTimeStamp(),
              parent_id: collection.parent_id
            })
            .where("collection.id", "=", collection.id)
            .executeTakeFirstOrThrow()
            .then(() => trx.selectFrom("collection")
              .selectAll()
              .where("collection.id", "=", Number(collection.id))
              .$castTo<CollectionDto>()
              .$call((q) => logCompilable(this.logService, q))
              .executeTakeFirst())
            .then((r: CollectionDto) => this.resultFactory.createSuccessResult<CollectionDto>(r));
        });
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<CollectionDto>(err);
    }
  }
  //#endregion
}
