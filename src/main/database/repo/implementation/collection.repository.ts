import { writeFileSync } from "fs";
import { DeleteResult, InsertResult, Transaction, UpdateResult } from "kysely";
import * as helpers from "kysely/helpers/sqlite";
import { inject, injectable } from "tsyringe";
import { ICollectionDto, IdSelectResult, IOwnedCardCollectionMapDto, IOwnedCardDto, IOwnedCardListDto, IOwnedCardQuantityDto } from "../../../../common/dto";
import { sqliteUTCTimeStamp } from "../../../../common/util";
import { IResult } from "../../../services/base";
import { IDatabaseService, ILogService, IResultFactory } from "../../../services/infra/interfaces";
import { INFRASTRUCTURE } from "../../../services/service.tokens";
import { logCompilable } from "../../log-compilable";
import { CARD_TABLE_FIELDS, DatabaseSchema } from "../../schema";
import { OWNED_CARD_COLLECTION_MAP_TABLE_FIELDS, OWNED_CARD_TABLE_FIELDS } from "../../schema/collection/table-field.constants";
import { ICollectionRepository } from "../interfaces/collection.repository";
import { BaseRepository } from "./base.repository";
import { $cardColors, $cardFaces, $oracle } from "./helpers";

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
  public getAllCollections(): Promise<IResult<Array<ICollectionDto>>> {
    try {
      return this.database.selectFrom("collection")
        .selectAll()
        .$castTo<ICollectionDto>()
        .execute()
        .then((qryResult: Array<ICollectionDto>) => this.resultFactory.createSuccessResult<Array<ICollectionDto>>(qryResult));
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<Array<ICollectionDto>>(err);
    }
  }

  public getCardQuantitiesForCardInCollection(cardId: string, collectionId: number): Promise<IResult<Array<IOwnedCardQuantityDto>>> {
    try {
      return this.database.selectFrom("owned_card")
        .select((eb) => [
          ...OWNED_CARD_TABLE_FIELDS,
          helpers.jsonArrayFrom<IOwnedCardCollectionMapDto>(
            eb.selectFrom("owned_card_collection_map")
              .select([...OWNED_CARD_COLLECTION_MAP_TABLE_FIELDS])
              .whereRef("owned_card_collection_map.owned_card_id", "=", "owned_card.id")
              .where("owned_card_collection_map.collection_id", "=", collectionId)
              .$castTo<IOwnedCardCollectionMapDto>()
          )
            .as("collectionMaps")
        ])
        .innerJoin("owned_card_collection_map as occm", "occm.owned_card_id", "owned_card.id")
        .where("owned_card.card_id", "=", cardId)
        .where("occm.collection_id", "=", collectionId)
        .$castTo<IOwnedCardQuantityDto>()
        // .$call((q) => logCompilable(this.logService, q))
        .execute()
        .then((qryResult: Array<IOwnedCardQuantityDto>) => {
          writeFileSync("c:/data/new-assistant/json/getCardQuantitiesForCardInCollection.json", JSON.stringify(qryResult, null, 2));
          return this.resultFactory.createSuccessResult<Array<IOwnedCardQuantityDto>>(qryResult);
        });
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<Array<IOwnedCardQuantityDto>>(err);
    }
  }

  public getCardQuantitiesForCard(cardId: string): Promise<IResult<Array<IOwnedCardQuantityDto>>> {
    try {
      return this.database.selectFrom("owned_card")
        .select((eb) => [
          ...OWNED_CARD_TABLE_FIELDS,
          helpers.jsonArrayFrom<IOwnedCardCollectionMapDto>(
            eb.selectFrom("owned_card_collection_map")
              .select([...OWNED_CARD_COLLECTION_MAP_TABLE_FIELDS])
              .whereRef("owned_card_collection_map.owned_card_id", "=", "owned_card.id")
              .$castTo<IOwnedCardCollectionMapDto>()
          )
            .as("collectionMaps")
        ])
        .innerJoin("owned_card_collection_map as occm", "occm.owned_card_id", "owned_card.id")
        .where("owned_card.card_id", "=", cardId)
        .groupBy("owned_card.id")
        .$call((q) => logCompilable(this.logService, q))
        .$castTo<IOwnedCardQuantityDto>()
        .execute()
        .then((qryResult: Array<IOwnedCardQuantityDto>) => {
          writeFileSync("c:/data/new-assistant/json/getCardQuantitiesForCard.json", JSON.stringify(qryResult, null, 2));
          return this.resultFactory.createSuccessResult<Array<IOwnedCardQuantityDto>>(qryResult);
        });
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<Array<IOwnedCardQuantityDto>>(err);
    }
  }

  public getCollectionCardList(id: number): Promise<IResult<Array<IOwnedCardListDto>>> {
    try {
      return this.database.selectFrom("card")
        .select((eb) => [
          ...CARD_TABLE_FIELDS,
          $cardFaces(eb.ref("card.id")).as("cardfaces"),
          $oracle(eb.ref("card.oracle_id")).as("oracle"),
          helpers.jsonArrayFrom<IOwnedCardDto>(
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
              .$castTo<IOwnedCardDto>()
          ).as("ownedCards"),
          $cardColors(eb.ref("card.id")).as("cardColors")
        ])
        .innerJoin("owned_card", "owned_card.card_id", "card.id")
        .innerJoin("owned_card_collection_map", "owned_card_collection_map.owned_card_id", "owned_card.id")
        .where("owned_card_collection_map.collection_id", "=", id)
        .groupBy("card.id")
        .$call((q) => logCompilable(this.logService, q))
        .$castTo<IOwnedCardListDto>()
        .execute()
        .then((qryResult: Array<IOwnedCardListDto>) => {
          writeFileSync("c:/data/new-assistant/json/getCollectionCardList.json", JSON.stringify(qryResult, null, 2));
          return this.resultFactory.createSuccessResult(qryResult);
        });
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<Array<IOwnedCardListDto>>(err);
    }
  }

  public createCollection(collection: ICollectionDto): Promise<IResult<ICollectionDto>> {
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
              .$castTo<ICollectionDto>()
              // .$call((q) => logCompilable(this.logService, q))
              .executeTakeFirst())
            .then((r: ICollectionDto) => this.resultFactory.createSuccessResult<ICollectionDto>(r));
        });
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<ICollectionDto>(err);
    }
  }

  public deleteCollection(id: number): Promise<IResult<number>> {
    try {
      return this.database.transaction()
        .execute(async (trx: Transaction<DatabaseSchema>) => {
          return trx
            .deleteFrom("collection")
            .where("collection.id", "=", id)
            .executeTakeFirstOrThrow()
            .then((r: DeleteResult) => {
              if (r.numDeletedRows > 0) {
                this.resultFactory.createSuccessResult<number>(Number(r.numDeletedRows));
              } else {
                return this.resultFactory.createNotFoundResult(`Collection with id '${id}'`);
              }
            });
        });
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<number>(err);
    }
  }

  public saveQuantitiesForCard(cardId: string, quantities: Array<IOwnedCardQuantityDto>): Promise<IResult<Array<IOwnedCardQuantityDto>>> {
    writeFileSync("c:/data/new-assistant/json/saveQuantitiesForCard.json", JSON.stringify(quantities, null, 2));
    if (quantities.findIndex((ocq: IOwnedCardQuantityDto) => ocq.card_id != cardId) >= 0) {
      return this.resultFactory.createBadRequestResultPromise<Array<IOwnedCardQuantityDto>>();
    }
    try {
      return this.saveQuantities(quantities).then((_r: IResult<void>) => this.getCardQuantitiesForCard(cardId));
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<Array<IOwnedCardQuantityDto>>(err);
    }
  }

  public saveQuantitiesForCardInCollection(
    cardId: string,
    collectionId: number,
    quantities: Array<IOwnedCardQuantityDto>
  ): Promise<IResult<Array<IOwnedCardQuantityDto>>> {
    writeFileSync("c:/data/new-assistant/json/saveQuantitiesForCardInCollection.json", JSON.stringify(quantities, null, 2));
    if (quantities.findIndex((ocq: IOwnedCardQuantityDto) => ocq.card_id != cardId) >= 0) {
      return this.resultFactory.createBadRequestResultPromise<Array<IOwnedCardQuantityDto>>();
    }
    if (quantities.map((ocq: IOwnedCardQuantityDto) => ocq.collectionMaps)
      .flat(1)
      .findIndex((cm: IOwnedCardCollectionMapDto) => cm.collection_id != collectionId) >= 0
    ) {
      return this.resultFactory.createBadRequestResultPromise<Array<IOwnedCardQuantityDto>>();
    }

    try {
      return this.saveQuantities(quantities).then((_r: IResult<void>) => this.getCardQuantitiesForCard(cardId));
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<Array<IOwnedCardQuantityDto>>(err);
    }
  }

  public updateCollection(collection: ICollectionDto): Promise<IResult<ICollectionDto>> {
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
              .$castTo<ICollectionDto>()
              // .$call((q) => logCompilable(this.logService, q))
              .executeTakeFirst())
            .then((r: ICollectionDto) => this.resultFactory.createSuccessResult<ICollectionDto>(r));
        });
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<ICollectionDto>(err);
    }
  }
  //#endregion

  //#endregion Auxiliary methods ----------------------------------------------
  private saveQuantities(quantities: Array<IOwnedCardQuantityDto>): Promise<IResult<void>> {
    const now = sqliteUTCTimeStamp();
    return this.database.transaction()
      .execute(async (trx: Transaction<DatabaseSchema>) => {
        // save the new owned cards -> those with id equal to zero
        const newOwnedCardIds = quantities.filter((ocq: IOwnedCardQuantityDto) => ocq.id == 0).map((ocq: IOwnedCardQuantityDto) => {
          return trx
            .insertInto("owned_card")
            .values({
              card_id: ocq.card_id,
              condition_id: ocq.condition_id,
              created_at: now,
              is_foil: ocq.is_foil ? 1 : 0,
              modified_at: now
            })
            .$call((q) => logCompilable(this.logService, q))
            .executeTakeFirstOrThrow()
            .then((r: InsertResult) => trx.selectFrom("owned_card")
              .select("owned_card.id")
              .where("owned_card.id", "=", Number(r.insertId))
              .$castTo<IdSelectResult<number>>()
              .$call((q) => logCompilable(this.logService, q))
              .executeTakeFirst()
              .then((own: IdSelectResult<number>) => {
                // as this is a new owned_card, we can just save all collectionMaps because they also have to be new
                return Promise.all([
                  ...ocq.collectionMaps.map((cm: IOwnedCardCollectionMapDto) => trx.insertInto("owned_card_collection_map")
                    .values({
                      collection_id: cm.collection_id,
                      created_at: now,
                      modified_at: now,
                      owned_card_id: own.id,
                      quantity: cm.quantity
                    })
                    .$call((q) => logCompilable(this.logService, q))
                    .executeTakeFirst())
                ])
                  .then(() => own.id);
              })
            );
        });
        // update the existing own cards -> those who have an id
        const existingOwnCardIds = quantities.filter((ocq: IOwnedCardQuantityDto) => ocq.id > 0).map((ocqq: IOwnedCardQuantityDto) => {
          return trx.updateTable("owned_card")
            .set({ modified_at: now })
            .where("owned_card.id", "=", ocqq.id)
            .executeTakeFirstOrThrow()
            .then(async (_r: UpdateResult) => {
              // save the new ones
              const newMaps = ocqq.collectionMaps.filter((cm: IOwnedCardCollectionMapDto) => cm.owned_card_id == 0).map((cm: IOwnedCardCollectionMapDto) => {
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
              const existingMaps = ocqq.collectionMaps.filter((cm: IOwnedCardCollectionMapDto) => cm.owned_card_id != 0).map((cm: IOwnedCardCollectionMapDto) => {
                if (cm.quantity == 0) {
                  // delete maps with quantity 0
                  return trx.deleteFrom("owned_card_collection_map")
                    .where("owned_card_collection_map.collection_id", "=", cm.collection_id)
                    .where("owned_card_collection_map.owned_card_id", "=", cm.owned_card_id)
                    .executeTakeFirstOrThrow()
                    .then((ur: DeleteResult) => ur.numDeletedRows);
                } else {
                  // update the existing ones with the new quantity
                  return trx.updateTable("owned_card_collection_map")
                    .set({
                      modified_at: now,
                      quantity: cm.quantity
                    })
                    .where("owned_card_collection_map.collection_id", "=", cm.collection_id)
                    .where("owned_card_collection_map.owned_card_id", "=", cm.owned_card_id)
                    .executeTakeFirstOrThrow()
                    .then((ur: UpdateResult) => ur.numUpdatedRows);
                }
              });
              return Promise.all([
                ...existingMaps,
                ...newMaps
              ]);
            });
        });
        return Promise
          .all([
            ...newOwnedCardIds,
            ...existingOwnCardIds
          ])
          .then(() => trx
            .deleteFrom("owned_card")
            .where(
              (eb) => eb.not(eb.exists(
                eb.selectFrom("owned_card_collection_map")
                  .select("owned_card_collection_map.owned_card_id")
                  .whereRef("owned_card_collection_map.owned_card_id", "=", "owned_card.id")
              ))
            )
            .$call((q) => logCompilable(this.logService, q))
            .execute()
          )
          .then(() => this.resultFactory.createSuccessResult<void>(undefined));
      });
  }
  //#endregion
}
