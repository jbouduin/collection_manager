import fs from "fs";
import { Compilable, ExpressionOrFactory, InsertResult, SqlBool, Transaction, UpdateResult, sql } from "kysely";
import { inject, injectable } from "tsyringe";

import { CardLegality, Game, GameFormat, ImageSize, MTGColor, MTGColorType } from "../../../../../common/enums";
import { CardSyncOptions, ProgressCallback } from "../../../../../common/ipc-params";
import { DatabaseSchema } from "../../../../../main/database/schema";
import INFRATOKENS, { IDatabaseService } from "../../../../../main/services/infra/interfaces";
import ADAPTTOKENS, {
  ICardAdapter, ICardCardMapAdapter, ICardColorMapAdapter, ICardGameAdapter,
  ICardImageAdapter, ICardMultiverseIdAdapter, ICardfaceAdapter, ICardfaceColorMapAdapter, ICardfaceImageAdapter,
  IOracleAdapter,
  IOracleKeywordAdapter,
  IOracleLegalityAdapter,
  OracleLegalityAdapterParameter
} from "../../adapt/interface";
import CLIENTTOKENS, { IScryfallClient } from "../../client/interfaces";
import { ScryfallCard, ScryfallCardFace, ScryfallRelatedCard } from "../../types";
import { ICardSyncService } from "../interface";
import { BaseSyncService } from "./base-sync.service";
import { ExtractTableAlias } from "kysely/dist/cjs/parser/table-parser";
import { INewTableAdapter } from "../../adapt/interface/table.adapter";
import { runSerial } from "../../../../../main/services/infra/util";

type GenericSingleSyncParameter<TB extends keyof DatabaseSchema, S> = {
  trx: Transaction<DatabaseSchema>,
  tableName: TB,
  filter: ExpressionOrFactory<DatabaseSchema, ExtractTableAlias<DatabaseSchema, TB>, SqlBool>,
  adapter: INewTableAdapter<TB, S>,
  scryfall: S,

};


@injectable()
export class CardSyncService extends BaseSyncService<CardSyncOptions> implements ICardSyncService {

  //#region Private readonly fields -------------------------------------------
  private readonly scryfallclient: IScryfallClient;
  private readonly cardAdapter: ICardAdapter;
  private readonly oracleAdapter: IOracleAdapter;
  private readonly oracleKeywordAdapter: IOracleKeywordAdapter;
  private readonly oracleLegalityAdapter: IOracleLegalityAdapter;
  private readonly cardGameAdapter: ICardGameAdapter;
  // private readonly cardCardMapAdapter: ICardCardMapAdapter;
  // private readonly cardColorMapAdapter: ICardColorMapAdapter;
  // private readonly cardfaceAdapter: ICardfaceAdapter;
  // private readonly cardfaceColorMapAdapter: ICardfaceColorMapAdapter;
  // private readonly cardfaceImageAdapter: ICardfaceImageAdapter;
  // private readonly cardImageAdapter: ICardImageAdapter;
  private readonly cardMultiverseIdAdapter: ICardMultiverseIdAdapter;

  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(
    @inject(INFRATOKENS.DatabaseService) databaseService: IDatabaseService,
    @inject(CLIENTTOKENS.ScryfallClient) scryfallclient: IScryfallClient,
    @inject(ADAPTTOKENS.CardAdapter) cardAdapter: ICardAdapter,
    @inject(ADAPTTOKENS.CardGameAdapter) cardGameAdapter: ICardGameAdapter,
    // @inject(ADAPTTOKENS.CardCardMapAdapter) cardCardMapAdapter: ICardCardMapAdapter,
    // @inject(ADAPTTOKENS.CardColorMapAdapter) cardColorMapAdapter: ICardColorMapAdapter,
    // @inject(ADAPTTOKENS.CardfaceAdapter) cardfaceAdapter: ICardfaceAdapter,
    // @inject(ADAPTTOKENS.CardfaceColorMapAdapter) cardfaceColorMapAdapter: ICardfaceColorMapAdapter,
    // @inject(ADAPTTOKENS.CardfaceImageAdapter) cardfaceImageAdapter: ICardfaceImageAdapter,
    // @inject(ADAPTTOKENS.CardImageAdapter) cardImageAdapter: ICardImageAdapter,
    @inject(ADAPTTOKENS.CardMultiverseIdAdapter) cardMultiverseIdAdapter: ICardMultiverseIdAdapter,
    @inject(ADAPTTOKENS.OracleAdapter) oracleAdapter: IOracleAdapter,
    @inject(ADAPTTOKENS.OracleKeywordAdapter) oracleKeywordAdapter: IOracleKeywordAdapter,
    @inject(ADAPTTOKENS.OracleLegalityAdapter) oracleLegalityAdapter: IOracleLegalityAdapter) {
    super(databaseService);
    this.scryfallclient = scryfallclient;
    this.cardAdapter = cardAdapter;
    this.oracleAdapter = oracleAdapter;
    this.oracleKeywordAdapter = oracleKeywordAdapter;
    this.oracleLegalityAdapter = oracleLegalityAdapter;
    this.cardGameAdapter = cardGameAdapter;
    // this.cardCardMapAdapter = cardCardMapAdapter;
    // this.cardColorMapAdapter = cardColorMapAdapter;
    // this.cardfaceAdapter = cardfaceAdapter;
    // this.cardfaceColorMapAdapter = cardfaceColorMapAdapter;
    // this.cardfaceImageAdapter = cardfaceImageAdapter;
    // this.cardImageAdapter = cardImageAdapter;
    this.cardMultiverseIdAdapter = cardMultiverseIdAdapter;
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

  protected logCompilable<T extends Compilable>(compilable: T): T {
    console.log(compilable.compile());
    return compilable;
  }

  private async genericSingleSync<TB extends keyof DatabaseSchema, S>(
    trx: Transaction<DatabaseSchema>,
    tableName: TB,
    filter: ExpressionOrFactory<DatabaseSchema, ExtractTableAlias<DatabaseSchema, TB>, SqlBool>,
    adapter: INewTableAdapter<TB, S>,
    scryfall: S): Promise<InsertResult | UpdateResult> {
    const queryExisting = trx
      .selectFrom(tableName)
      .selectAll()
      .where(filter)
      .executeTakeFirst();

    const insertOrUpdate: Promise<InsertResult | UpdateResult> = queryExisting.then(async (queryResult) => {
      let result: Promise<InsertResult | UpdateResult>;
      if (queryResult) {
        result = trx.updateTable(tableName)
          .set(adapter.toUpdate(scryfall))
          .where(filter)
          .executeTakeFirstOrThrow();

      } else {
        result = trx.insertInto(tableName)
          .values(adapter.toInsert(scryfall))
          .executeTakeFirstOrThrow();
      }
      return result;
    });
    return insertOrUpdate;
  }

  private async serialGenericSingleSync<TB extends keyof DatabaseSchema, S>(
    taskParameter: GenericSingleSyncParameter<TB, S>, _index: number, _total: number): Promise<void> {
    await this.genericSingleSync(taskParameter.trx, taskParameter.tableName, taskParameter.filter, taskParameter.adapter, taskParameter.scryfall);
  }

  private async genericDeleteAndRecreate<TB extends keyof DatabaseSchema, S>(
    trx: Transaction<DatabaseSchema>,
    tableName: TB,
    filter: ExpressionOrFactory<DatabaseSchema, ExtractTableAlias<DatabaseSchema, TB>, SqlBool>,
    adapter: INewTableAdapter<TB, S>,
    scryfall: S) {

    return trx
      .deleteFrom(tableName)
      .where(filter)
      // .$call(this.logCompilable)
      .execute()
      .then(async () => await trx
        .insertInto(tableName)
        .values(adapter.toInsert(scryfall))
        // .$call(this.logCompilable)
        .executeTakeFirstOrThrow()
      );
  }

  private async syncSingleCard(card: ScryfallCard, cnt: number, total: number, progressCallback?: ProgressCallback): Promise<void> {
    return this.database.transaction().execute(async (trx: Transaction<DatabaseSchema>) => {
      if (progressCallback) {
        progressCallback(`Processing ${card.name} (${cnt}/${total})`);
      }
      let insertOrUpdate: Promise<InsertResult | UpdateResult> = this.genericSingleSync(
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
      // return insertOrUpdate.then(() =>
      //   Promise.all([
      //     this.syncCardCardMap(trx, card.id, null),
      //     this.syncCardColorMaps(trx, card.id, "card", card.colors),
      //     this.syncCardColorMaps(trx, card.id, "identity", card.color_identity),
      //     this.syncCardColorMaps(trx, card.id, "indicator", card.color_indicator),
      //     this.syncCardColorMaps(trx, card.id, "produced_mana", card.color_indicator),
      //     this.syncCardGame(trx, card.id, card.games),
      //     this.syncCardImages(trx, card.id, card.image_uris),
      //     this.syncMultiversId(trx, card.id, card.multiverse_ids),
      //     this.syncCardfaces(trx, card.id, card.card_faces)
      //   ])
      // ); //.then(() =>
    }).then(
      null,
      (reason) => {

        console.log(reason);
      }
    );
  }

  private async syncOracle(trx: Transaction<DatabaseSchema>, scryfallCard: ScryfallCard): Promise<void> {
    if (scryfallCard.layout = "normal") {
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
      if (scryfallCard.layout = "normal") {
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
      const taskParameters = new Array<GenericSingleSyncParameter<"oracle_legality", OracleLegalityAdapterParameter>>();
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

      if (scryfallCard.layout = "normal") {
        await runSerial<GenericSingleSyncParameter<"oracle_legality", OracleLegalityAdapterParameter>>(
          taskParameters,
          async (param: GenericSingleSyncParameter<"oracle_legality", OracleLegalityAdapterParameter>, index: number, total: number) => this.serialGenericSingleSync(param, index, total)
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

  // private async syncCardColorMaps(trx: Transaction<DatabaseSchema>, cardId: string, colorType: MTGColorType, colors: Array<MTGColor> | null): Promise<void> {
  //   if (colors?.length > 0) {
  //     colors.forEach(async (color: MTGColor) => {
  //       const filter: ExpressionOrFactory<DatabaseSchema, "card_color_map", SqlBool> = (eb) => eb.and([
  //         eb("card_color_map.card_id", "=", cardId),
  //         eb("card_color_map.color_type", "=", colorType),
  //         eb("card_color_map.color_id", "=", color),
  //       ]);
  //       const existing = await trx
  //         .selectFrom("card_color_map")
  //         .select("card_color_map.card_id")
  //         .where(filter)
  //         .executeTakeFirst();

  //       if (existing) {
  //         await trx.updateTable("card_color_map")
  //           .set(this.cardColorMapAdapter.toUpdate(null))
  //           .executeTakeFirstOrThrow();
  //       }
  //       else {
  //         await trx.insertInto("card_color_map")
  //           .values(this.cardColorMapAdapter.toInsert(cardId, color, colorType))
  //           .executeTakeFirstOrThrow();
  //       }
  //     });
  //   }
  // }



  // private async syncCardKeyword(trx: Transaction<DatabaseSchema>, cardId: string, keywords: Array<string>): Promise<void> {
  //   // NOW
  //   return Promise.resolve();
  //   // keywords.forEach(async (keyword: string) => {
  //   //   const filter: ExpressionOrFactory<DatabaseSchema, "card_keyword", SqlBool> = (eb) =>
  //   //     eb.and([
  //   //       eb("card_keyword.card_id", "=", cardId),
  //   //       eb("card_keyword.keyword", "=", keyword)
  //   //     ]
  //   //     );
  //   //   const existing = await trx.selectFrom("card_keyword")
  //   //     .select("card_keyword.card_id")
  //   //     .where(filter)
  //   //     .executeTakeFirst();
  //   //   if (existing) {
  //   //     await trx.updateTable("card_keyword")
  //   //       .set(this.cardKeywordAdapter.toUpdate(null))
  //   //       .where(filter)
  //   //       .executeTakeFirstOrThrow();
  //   //   } else {
  //   //     await trx.insertInto("card_keyword")
  //   //       .values(this.cardKeywordAdapter.toInsert(cardId, keyword))
  //   //       .executeTakeFirstOrThrow();
  //   //   }
  //   // });
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

  // private async syncMultiversId(trx: Transaction<DatabaseSchema>, cardId: string, multiverseIds: Array<number> | null): Promise<void> {
  //   if (multiverseIds?.length > 0) {
  //     multiverseIds.forEach(async (game: number) => {
  //       const filter: ExpressionOrFactory<DatabaseSchema, "card_multiverse_id", SqlBool> = (eb) =>
  //         eb.and([
  //           eb("card_multiverse_id.card_id", "=", cardId),
  //           eb("card_multiverse_id.multiverse_id", "=", game)
  //         ]);

  //       const existing = await trx.selectFrom("card_multiverse_id")
  //         .select("card_multiverse_id.multiverse_id")
  //         .where(filter)
  //         .executeTakeFirst();

  //       if (existing) {
  //         await trx.updateTable("card_multiverse_id")
  //           .set(this.cardMultiverseIdAdapter.toUpdate(null))
  //           .where(filter)
  //           .executeTakeFirstOrThrow();
  //       } else {
  //         await trx.insertInto("card_multiverse_id")
  //           .values(this.cardMultiverseIdAdapter.toInsert(cardId, game))
  //           .executeTakeFirstOrThrow();
  //       }
  //     });
  //   }
  // }

  // private async syncCardfaces(trx: Transaction<DatabaseSchema>, cardId: string, cardfaces?: Array<ScryfallCardFace>): Promise<void> {
  //   // NOW
  //   return Promise.resolve();
  //   // if (cardfaces) {
  //   //   return Promise.all(cardfaces.map((cardface: ScryfallCardFace) => this.syncSingleCardface(trx, cardId, cardface)))
  //   //     .then(() => Promise.resolve());
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
