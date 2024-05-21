import fs from "fs";
import { InsertResult, Transaction, UpdateResult } from "kysely";
import { inject, injectable } from "tsyringe";
import { v1 as uuidV1 } from "uuid";

import { CardLegality, GameFormat } from "../../../../../common/enums";
import { CardSyncOptions, ProgressCallback } from "../../../../../common/ipc-params";
import { DatabaseSchema } from "../../../../../main/database/schema";
import INFRATOKENS, { IDatabaseService } from "../../../../../main/services/infra/interfaces";
import { runSerial } from "../../../../../main/services/infra/util";
import ADAPTTOKENS, {
  ICardAdapter,
  ICardGameAdapter,
  ICardMultiverseIdAdapter, ICardfaceAdapter, ICardfaceColorMapAdapter,
  ICardfaceLocalizationAdapter,
  ICardfaceLocalizationImageAdapter,
  IOracleAdapter,
  IOracleKeywordAdapter,
  IOracleLegalityAdapter
} from "../../adapt/interface";
import CLIENTTOKENS, { IScryfallClient } from "../../client/interfaces";
import { ScryfallCard } from "../../types";
import { ICardSyncService } from "../interface";
import { BaseSyncService } from "./base-sync.service";
import { GenericSyncTaskParameter } from "./generic-sync-task.parameter";
import { CardfaceColorMapAdapterParameter } from "../../adapt/interface/param/cardface-color-map-adapter.param";
import { OracleLegalityAdapterParameter } from "../../adapt/interface/param/oracle-legality-adapter.param";

@injectable()
export class CardSyncService extends BaseSyncService<CardSyncOptions> implements ICardSyncService {

  //#region Private readonly fields -------------------------------------------
  private readonly scryfallclient: IScryfallClient;
  private readonly cardAdapter: ICardAdapter;
  private readonly cardGameAdapter: ICardGameAdapter;
  private readonly cardMultiverseIdAdapter: ICardMultiverseIdAdapter;
  private readonly cardfaceAdapter: ICardfaceAdapter;
  private readonly cardfaceColorMapAdapter: ICardfaceColorMapAdapter;
  private readonly cardfaceLocalizationAdapter: ICardfaceLocalizationAdapter;
  private readonly cardfaceLocalizationImageAdapter: ICardfaceLocalizationImageAdapter;
  private readonly oracleAdapter: IOracleAdapter;
  private readonly oracleKeywordAdapter: IOracleKeywordAdapter;
  private readonly oracleLegalityAdapter: IOracleLegalityAdapter;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(
    @inject(INFRATOKENS.DatabaseService) databaseService: IDatabaseService,
    @inject(CLIENTTOKENS.ScryfallClient) scryfallclient: IScryfallClient,
    @inject(ADAPTTOKENS.CardAdapter) cardAdapter: ICardAdapter,
    @inject(ADAPTTOKENS.CardGameAdapter) cardGameAdapter: ICardGameAdapter,
    @inject(ADAPTTOKENS.CardMultiverseIdAdapter) cardMultiverseIdAdapter: ICardMultiverseIdAdapter,
    @inject(ADAPTTOKENS.CardfaceAdapter) cardfaceAdapter: ICardfaceAdapter,
    @inject(ADAPTTOKENS.CardfaceColorMapAdapter) cardfaceColorMapAdapter: ICardfaceColorMapAdapter,
    @inject(ADAPTTOKENS.CardfaceLocalizationAdapter) cardfaceLocalizationAdapter: ICardfaceLocalizationAdapter,
    @inject(ADAPTTOKENS.CardfaceLocalizationImageAdapter) cardfaceLocalizationImageAdapter: ICardfaceLocalizationImageAdapter,
    @inject(ADAPTTOKENS.OracleAdapter) oracleAdapter: IOracleAdapter,
    @inject(ADAPTTOKENS.OracleKeywordAdapter) oracleKeywordAdapter: IOracleKeywordAdapter,
    @inject(ADAPTTOKENS.OracleLegalityAdapter) oracleLegalityAdapter: IOracleLegalityAdapter) {
    super(databaseService);
    this.scryfallclient = scryfallclient;
    this.cardAdapter = cardAdapter;
    this.cardGameAdapter = cardGameAdapter;
    this.cardMultiverseIdAdapter = cardMultiverseIdAdapter;
    this.cardfaceAdapter = cardfaceAdapter;
    this.cardfaceColorMapAdapter = cardfaceColorMapAdapter;
    this.cardfaceLocalizationAdapter = cardfaceLocalizationAdapter;
    this.cardfaceLocalizationImageAdapter = cardfaceLocalizationImageAdapter;
    this.oracleAdapter = oracleAdapter;
    this.oracleKeywordAdapter = oracleKeywordAdapter;
    this.oracleLegalityAdapter = oracleLegalityAdapter;
  }
  //#endregion

  //#region ICardSyncService methods ------------------------------------------
  public override async sync(options: CardSyncOptions, progressCallback: ProgressCallback): Promise<void> {
    console.log("start CardSyncService.sync");
    if (progressCallback) {
      progressCallback("Sync cards");
    }
    // TODO: check if all required master data is available
    const cards = this.scryfallclient.getCards(options);
    return cards.then((cardArray: Array<ScryfallCard>) => {
      const fileName = "c:/data/new-assistant/json/cards_" + options.setCode + ".json";
      if (!fs.existsSync(fileName)) {
        const json = JSON.stringify(cardArray);
        fs.writeFileSync(fileName, json);
      }
      console.log("Found %d cards", cardArray.length);
      return this.processSync(cardArray, progressCallback);
    });
  }
  //#endregion

  //#region private sync methods ----------------------------------------------
  private async processSync(cards: Array<ScryfallCard>, progressCallback?: ProgressCallback): Promise<void> {
    const total = cards.length;
    let cnt = 0;
    return Promise
      .all(cards.map((card: ScryfallCard) => this.syncSingleCard(card, ++cnt, total, progressCallback)))
      .then(() => Promise.resolve());
  }



  private async syncSingleCard(card: ScryfallCard, cnt: number, total: number, progressCallback?: ProgressCallback): Promise<void> {
    return this.database.transaction().execute(async (trx: Transaction<DatabaseSchema>) => {
      if (progressCallback) {
        progressCallback(`Processing ${card.name} (${cnt}/${total})`);
      }
      const insertOrUpdate: Promise<InsertResult | UpdateResult> = this.genericSingleSync(
        trx,
        "card",
        (eb) => eb("card.id", "=", card.id),
        this.cardAdapter,
        card
      );

      return await insertOrUpdate
        .then(async () => await this.syncOracle(trx, card))
        .then(async () => await this.syncOracleKeywords(trx, card))
        .then(async () => await this.syncOracleLegalities(trx, card))
        .then(async () => await this.syncCardGames(trx, card))
        .then(async () => await this.syncMultiversIds(trx, card))
        .then(async () => await this.syncCardFaces(trx, card));
    }).then(
      null,
      (reason) => {

        console.log(reason);
      }
    );
  }

  private async syncOracle(trx: Transaction<DatabaseSchema>, scryfallCard: ScryfallCard): Promise<void> {
    if (scryfallCard.layout == "normal") {
      await this.genericSingleSync(
        trx,
        "oracle",
        (eb) => eb("oracle.oracle_id", "=", scryfallCard.oracle_id).and("oracle.face_name", "=", scryfallCard.name),
        this.oracleAdapter,
        { faceName: scryfallCard.name, scryfallCard: scryfallCard }
      );
    } else {
      return Promise.resolve();
    }
  }

  private async syncOracleKeywords(trx: Transaction<DatabaseSchema>, scryfallCard: ScryfallCard): Promise<void> {
    if (scryfallCard.keywords?.length > 0) {
      if (scryfallCard.layout == "normal") {
        await this.genericDeleteAndRecreate(
          trx,
          "oracle_keyword",
          (eb) => eb("oracle_keyword.oracle_id", "=", scryfallCard.oracle_id),
          this.oracleKeywordAdapter,
          { oracle_id: scryfallCard.oracle_id, keywords: scryfallCard.keywords }
        );
      } else {
        return Promise.resolve();
      }
    } else {
      return Promise.resolve();
    }
  }

  private async syncOracleLegalities(trx: Transaction<DatabaseSchema>, scryfallCard: ScryfallCard): Promise<void> {
    if (scryfallCard.legalities) {
      const taskParameters = new Array<GenericSyncTaskParameter<"oracle_legality", OracleLegalityAdapterParameter>>();
      Object.keys(scryfallCard.legalities).forEach((key: string) =>
        taskParameters.push({
          trx: trx,
          tableName: "oracle_legality",
          filter: (eb) => eb("oracle_legality.oracle_id", "=", scryfallCard.oracle_id).and("oracle_legality.format", "=", key as GameFormat),
          adapter: this.oracleLegalityAdapter,
          scryfall: {
            oracle_id: scryfallCard.oracle_id,
            gameFormat: key as GameFormat,
            legality: scryfallCard.legalities[key as keyof Record<GameFormat, CardLegality>] as CardLegality
          }
        })
      );

      if (scryfallCard.layout ==  "normal") {
        await runSerial<GenericSyncTaskParameter<"oracle_legality", OracleLegalityAdapterParameter>>(
          taskParameters,
          async (param: GenericSyncTaskParameter<"oracle_legality", OracleLegalityAdapterParameter>, index: number, total: number) => super.serialGenericSingleSync(param, index, total)
        );
      } else {
        return Promise.resolve();
      }
    } else {
      return Promise.resolve();
    }
  }

  private async syncCardGames(trx: Transaction<DatabaseSchema>, scryfallCard: ScryfallCard): Promise<void> {
    if (scryfallCard.games?.length > 0) {
      await this.genericDeleteAndRecreate(
        trx,
        "card_game",
        (eb) => eb("card_game.card_id", "=", scryfallCard.id),
        this.cardGameAdapter,
        { card_id: scryfallCard.id, games: scryfallCard.games }
      );
    } else {
      return Promise.resolve();
    }
  }

  private async syncMultiversIds(trx: Transaction<DatabaseSchema>, scryfallCard: ScryfallCard): Promise<void> {
    if (scryfallCard.multiverse_ids?.length > 0) {
      await this.genericDeleteAndRecreate(
        trx,
        "card_multiverse_id",
        (eb) => eb("card_multiverse_id.card_id", "=", scryfallCard.id),
        this.cardMultiverseIdAdapter,
        { card_id: scryfallCard.id, multiverseIds: scryfallCard.multiverse_ids }
      );
    } else {
      return Promise.resolve();
    }
  }

  private async syncCardFaces(trx: Transaction<DatabaseSchema>, scryfallCard: ScryfallCard): Promise<void> {
    // if layout is normal: scrfall does not return cardfaces, so we save the whole card a single cardface
    if (scryfallCard.layout == "normal") {
      const cardfaceUuid = uuidV1();
      await this
        .genericDeleteAndRecreate(
          trx,
          "cardface",
          (eb) => eb("cardface.card_id", "=", scryfallCard.id),
          this.cardfaceAdapter,
          { uuid: cardfaceUuid, faceName: scryfallCard.name, scryfallCard: scryfallCard }
        )
        .then(async () => {
          const taskParameters = new Array<GenericSyncTaskParameter<"cardface_color_map", CardfaceColorMapAdapterParameter>>();

          if (scryfallCard.colors?.length > 0) {
            taskParameters.push({
              trx: trx,
              tableName: "cardface_color_map",
              filter: (eb) => eb("cardface_color_map.cardface_id", "=", cardfaceUuid), // TODO useless as cascaded delete should have removed old stuff
              adapter: this.cardfaceColorMapAdapter,
              scryfall: { cardfaceId: cardfaceUuid, colorType: "card", colors: scryfallCard.colors }
            });
          }

          if (scryfallCard.color_identity?.length > 0) {
            taskParameters.push({
              trx: trx,
              tableName: "cardface_color_map",
              filter: (eb) => eb("cardface_color_map.cardface_id", "=", cardfaceUuid),
              adapter: this.cardfaceColorMapAdapter,
              scryfall: { cardfaceId: cardfaceUuid, colorType: "identity", colors: scryfallCard.color_identity }
            });
          }

          if (scryfallCard.color_indicator?.length > 0) {
            taskParameters.push({
              trx: trx,
              tableName: "cardface_color_map",
              filter: (eb) => eb("cardface_color_map.cardface_id", "=", cardfaceUuid),
              adapter: this.cardfaceColorMapAdapter,
              scryfall: { cardfaceId: cardfaceUuid, colorType: "indicator", colors: scryfallCard.color_indicator }
            });
          }

          if (scryfallCard.produced_mana?.length > 0) {
            taskParameters.push({
              trx: trx,
              tableName: "cardface_color_map",
              filter: (eb) => eb("cardface_color_map.cardface_id", "=", cardfaceUuid),
              adapter: this.cardfaceColorMapAdapter,
              scryfall: { cardfaceId: cardfaceUuid, colorType: "produced_mana", colors: scryfallCard.produced_mana }
            });
          }

          await runSerial<GenericSyncTaskParameter<"cardface_color_map", CardfaceColorMapAdapterParameter>>(
            taskParameters,
            async (param: GenericSyncTaskParameter<"cardface_color_map", CardfaceColorMapAdapterParameter>, index: number, total: number) => this.serialGenericDeleteAndRecreate(param, index, total)
          );
        })
        .then(async () => {
          const localizationUuid = uuidV1();
          await this.genericDeleteAndRecreate(
            trx,
            "cardface_localization",
            (eb) => eb("cardface_localization.cardface_id", "=", cardfaceUuid), // TODO not required because of cascaded delete
            this.cardfaceLocalizationAdapter,
            { uuid: localizationUuid, cardfaceId: cardfaceUuid, scryfallCard: scryfallCard }
          ).then(async () => {
            await this.genericDeleteAndRecreate(
              trx,
              "cardface_localization_image",
              (eb) => eb("cardface_localization_image.cardface_localization_id", "=", localizationUuid), // TODO not required because of cascaded delete
              this.cardfaceLocalizationImageAdapter,
              { cardfaceLocalizationId: localizationUuid, scryfallCard: scryfallCard }
            );
          });
        });
    }
  }

  // private async syncCardCardMap(trx: Transaction<DatabaseSchema>, cardId: string, relatedCards: Array<ScryfallRelatedCard>): Promise<void> {
  //   if (relatedCards?.length > 0) {
  //     relatedCards.forEach(async (relatedCard: ScryfallRelatedCard) => {
  //       const filter: ExpressionOrFactory<DatabaseSchema, "card_card_map", SqlBool> = (eb) => eb.and([
  //         eb("card_card_map.card_id", "=", cardId),
  //         eb("card_card_map.related_card_id", "=", relatedCard.id)
  //       ]);
  //       const existing = await trx
  //         .selectFrom("card_card_map")
  //         .select("card_card_map.card_id")
  //         .where(filter)
  //         .executeTakeFirst();

  //       if (existing) {
  //         await trx.updateTable("card_card_map")
  //           .set(this.cardCardMapAdapter.toUpdate(null))
  //           .executeTakeFirstOrThrow();
  //       }
  //       else {
  //         await trx.insertInto("card_card_map")
  //           .values(this.cardCardMapAdapter.toInsert(cardId, relatedCard.id, relatedCard))
  //           .executeTakeFirstOrThrow();
  //       }
  //     });
  //   }
  // }

  // private async syncCardImages(trx: Transaction<DatabaseSchema>, cardId: string, images: Record<ImageSize, string>): Promise<void> {
  //   // NOW
  //   return Promise.resolve();
  //   // if (images) {
  //   //   Object.keys(images).forEach(async (key: string) => {
  //   //     await this.syncSingleCardImage(trx, cardId, key as ImageSize, images[key as keyof Record<ImageSize, string>] as string);
  //   //   });
  //   // }
  // }

  // private async syncSingleCardImage(trx: Transaction<DatabaseSchema>, cardId: string, imageType: ImageSize, uri: string): Promise<void> {
  //   // NOW
  //   return Promise.resolve();
  //   // if (uri) {
  //   //   const filter: ExpressionOrFactory<DatabaseSchema, "card_image", SqlBool> = (eb) =>
  //   //     eb.and([
  //   //       eb("card_image.card_id", "=", cardId),
  //   //       eb("card_image.image_type", "=", imageType)
  //   //     ]);
  //   //   const existing = await trx.selectFrom("card_image")
  //   //     .select("card_image.card_id")
  //   //     .where(filter)
  //   //     .executeTakeFirst();

  //   //   if (existing) {
  //   //     await trx.updateTable("card_image")
  //   //       .set(this.cardImageAdapter.toUpdate({ type: imageType, uri: uri }))
  //   //       .where(filter)
  //   //       .executeTakeFirstOrThrow();
  //   //   } else {
  //   //     await trx.insertInto("card_image")
  //   //       .values(this.cardImageAdapter.toInsert(cardId, { type: imageType, uri: uri }))
  //   //       .executeTakeFirstOrThrow();
  //   //   }
  //   // }
  // }





  // private async syncSingleCardface(trx: Transaction<DatabaseSchema>, cardId: string, cardface: ScryfallCardFace): Promise<void> {
  //   // NOW
  //   return Promise.resolve();
  //   // because cardfaces do not have a unique id, we delete the exisitng ones first, before re-creating them
  //   // const deleteFilter: ExpressionOrFactory<DatabaseSchema, "cardface", SqlBool> = (eb) => eb("cardface.card_id", "=", cardId);
  //   // trx.deleteFrom("cardface").where(deleteFilter).execute()
  //   //   .then(() => {
  //   //     trx.insertInto("cardface").values(this.cardfaceAdapter.toInsert(cardId, cardface)).executeTakeFirstOrThrow()
  //   //       .then((insertResult: InsertResult) => {
  //   //         trx.selectFrom("cardface").select("cardface.id").where(sql`ROWID`, "=", insertResult.insertId).executeTakeFirst()
  //   //           .then((cardfaceId: { id: string }) => {
  //   //             return Promise.all([
  //   //               this.syncCardfaceColorMaps(trx, cardfaceId.id, "indicator", cardface.color_indicator), // found no json yet where this was set
  //   //               this.syncCardfaceColorMaps(trx, cardfaceId.id, "card", cardface.colors),
  //   //               this.syncCardfaceImages(trx, cardfaceId.id, cardface.image_uris)
  //   //             ]);
  //   //           });
  //   //       });
  //   //   });
  //   // return Promise.resolve();
  // }

  // private async syncCardfaceColorMaps(trx: Transaction<DatabaseSchema>, cardfaceId: string, colorType: MTGColorType, colors: Array<MTGColor> | null): Promise<void> {
  //   // NOW
  //   return Promise.resolve();
  //   // if (colors?.length > 0) {
  //   //   const result: Array<Promise<InsertResult | UpdateResult>> = new Array<Promise<InsertResult | UpdateResult>>();
  //   //   colors.forEach(async (color: MTGColor) => {
  //   //     const filter: ExpressionOrFactory<DatabaseSchema, "cardface_color_map", SqlBool> = (eb) => eb.and([
  //   //       eb("cardface_color_map.cardface_id", "=", cardfaceId),
  //   //       eb("cardface_color_map.color_type", "=", colorType),
  //   //       eb("cardface_color_map.color_id", "=", color),
  //   //     ]);
  //   //     const existing = trx
  //   //       .selectFrom("cardface_color_map")
  //   //       .select("cardface_color_map.cardface_id")
  //   //       .where(filter)
  //   //       .executeTakeFirst();

  //   //     existing.then((queryResult: { cardface_id: string }) => {
  //   //       if (queryResult) {
  //   //         result.push(trx.updateTable("cardface_color_map")
  //   //           .set(this.cardfaceColorMapAdapter.toUpdate(null))
  //   //           .executeTakeFirstOrThrow());
  //   //       }
  //   //       else {
  //   //         result.push(trx.insertInto("cardface_color_map")
  //   //           .values(this.cardfaceColorMapAdapter.toInsert(cardfaceId, color, colorType))
  //   //           .executeTakeFirstOrThrow());
  //   //       }
  //   //     });
  //   //   });
  //   //   return Promise.all(result).then(() => Promise.resolve());
  //   // } else {
  //   //   return Promise.resolve();
  //   // }

  // }

  // private async syncCardfaceImages(trx: Transaction<DatabaseSchema>, cardfaceId: string, images?: Record<ImageSize, string>): Promise<void> {
  //   // NOW
  //   return Promise.resolve();
  //   // const result: Array<Promise<void>> = new Array<Promise<void>>();
  //   // if (images) {
  //   //   Object.keys(images).forEach(async (key: string) => {
  //   //     result.push(this.syncSingleCardfaceImage(trx, cardfaceId, key as ImageSize, images[key as keyof Record<ImageSize, string>] as string));
  //   //   });
  //   // }
  //   // return Promise.all(result).then(() => Promise.resolve());
  // }

  // private async syncSingleCardfaceImage(trx: Transaction<DatabaseSchema>, cardfaceId: string, imageType: ImageSize, uri: string): Promise<void> {
  //   // NOW
  //   return Promise.resolve();
  //   // if (uri) {
  //   //   const filter: ExpressionOrFactory<DatabaseSchema, "cardface_image", SqlBool> = (eb) =>
  //   //     eb.and([
  //   //       eb("cardface_image.cardface_id", "=", cardfaceId),
  //   //       eb("cardface_image.image_type", "=", imageType)
  //   //     ]);
  //   //   const existing = await trx.selectFrom("cardface_image")
  //   //     .select("cardface_image.cardface_id")
  //   //     .where(filter)
  //   //     .executeTakeFirst();

  //   //   if (existing) {
  //   //     await trx.updateTable("cardface_image")
  //   //       .set(this.cardfaceImageAdapter.toUpdate({ type: imageType, uri: uri }))
  //   //       .where(filter)
  //   //       .executeTakeFirstOrThrow();
  //   //   } else {
  //   //     await trx.insertInto("cardface_image")
  //   //       .values(this.cardfaceImageAdapter.toInsert(cardfaceId, { type: imageType, uri: uri }))
  //   //       .executeTakeFirstOrThrow();
  //   //   }
  //   // }
  // }
  //#endregion


}
