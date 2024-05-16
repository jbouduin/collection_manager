import { ExpressionOrFactory, InsertResult, SqlBool, Transaction, UpdateResult, sql } from "kysely";
import {
  Color, Game, ImageUris, Legalities, RelatedCard,
  CardFace as ScryFallCardface,
  Card as ScryfallCard
} from "scryfall-sdk";
import { inject, injectable } from "tsyringe";

import { CardImageSelectDto, CardSelectDto, } from "../../../../common/dto";
import { CardColorType, CardLegality, GameFormat, ImageType } from "../../../../common/enums";
import { CardQueryOptions } from "../../../../common/ipc-params/card-query.options";
import { Card, DatabaseSchema } from "../../../../main/database/schema";
import ADAPTTOKENS, {
  ICardAdapter, ICardCardMapAdapter, ICardColorMapAdapter, ICardFormatLegalityAdapter,
  ICardGameAdapter, ICardImageAdapter, ICardKeywordAdapter, ICardMultiverseIdAdapter,
  ICardfaceAdapter, ICardfaceColorMapAdapter, ICardfaceImageAdapter
} from "../../adapt/interfaces";
import INFRATOKENS, { IImageCacheService, IDatabaseService } from "../../infra/interfaces";
import REPOTOKENS, { ICardRepository, ISymbologyRepository } from "../interfaces";
import { BaseRepository } from "./base.repository";
import { ProgressCallback } from "../../../../common/ipc-params";



@injectable()
export class CardRepository extends BaseRepository implements ICardRepository {

  //#region Private readonly properties: Adapters -----------------------------
  private readonly cardCardMapAdapter: ICardCardMapAdapter;
  private readonly cardColorMapAdapter: ICardColorMapAdapter;
  private readonly cardfaceAdapter: ICardfaceAdapter;
  private readonly cardfaceColorMapAdapter: ICardfaceColorMapAdapter;
  private readonly cardfaceImageAdapter: ICardfaceImageAdapter;
  private readonly cardFormatLegalityAdapter: ICardFormatLegalityAdapter;
  private readonly cardGameAdapter: ICardGameAdapter;
  private readonly cardImageAdapter: ICardImageAdapter;
  private readonly cardKeywordAdapter: ICardKeywordAdapter;
  private readonly cardMultiverseIdAdapter: ICardMultiverseIdAdapter;
  private readonly cardAdapter: ICardAdapter;
  //#endregion

  //#region Private readonly properties: Other --------------------------------
  private readonly imageCacheService: IImageCacheService;
  private readonly symbologyRepository: ISymbologyRepository;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(
    @inject(INFRATOKENS.DatabaseService) databaseService: IDatabaseService,
    @inject(ADAPTTOKENS.CardCardMapAdapter) cardCardMapAdapter: ICardCardMapAdapter,
    @inject(ADAPTTOKENS.CardColorMapAdapter) cardColorMapAdapter: ICardColorMapAdapter,
    @inject(ADAPTTOKENS.CardfaceAdapter) cardfaceAdapter: ICardfaceAdapter,
    @inject(ADAPTTOKENS.CardfaceColorMapAdapter) cardfaceColorMapAdapter: ICardfaceColorMapAdapter,
    @inject(ADAPTTOKENS.CardfaceImageAdapter) cardfaceImageAdapter: ICardfaceImageAdapter,
    @inject(ADAPTTOKENS.CardFormatLegalityAdapter) cardFormatLegalityAdapter: ICardFormatLegalityAdapter,
    @inject(ADAPTTOKENS.CardGameAdapter) cardGameAdapter: ICardGameAdapter,
    @inject(ADAPTTOKENS.CardImageAdapter) cardImageAdapter: ICardImageAdapter,
    @inject(ADAPTTOKENS.CardKeywordAdapter) cardKeywordAdapter: ICardKeywordAdapter,
    @inject(ADAPTTOKENS.CardMultiverseIdAdapter) cardMultiverseIdAdapter: ICardMultiverseIdAdapter,
    @inject(ADAPTTOKENS.CardAdapter) cardAdapter: ICardAdapter,
    @inject(INFRATOKENS.ImageCacheService) imageCacheService: IImageCacheService,
    @inject(REPOTOKENS.SymbologyRepository) symbologyRepository: ISymbologyRepository
  ) {
    super(databaseService);
    this.cardCardMapAdapter = cardCardMapAdapter;
    this.cardColorMapAdapter = cardColorMapAdapter;
    this.cardfaceAdapter = cardfaceAdapter;
    this.cardfaceColorMapAdapter = cardfaceColorMapAdapter;
    this.cardfaceImageAdapter = cardfaceImageAdapter;
    this.cardFormatLegalityAdapter = cardFormatLegalityAdapter;
    this.cardGameAdapter = cardGameAdapter;
    this.cardImageAdapter = cardImageAdapter;
    this.cardKeywordAdapter = cardKeywordAdapter;
    this.cardMultiverseIdAdapter = cardMultiverseIdAdapter;
    this.cardAdapter = cardAdapter;
    this.imageCacheService = imageCacheService;
    this.symbologyRepository = symbologyRepository;
  }
  //#endregion

  //#region ICardRepository methods -------------------------------------------
  public async getCardById(cardId: string): Promise<CardSelectDto> {
    return this.database
      .selectFrom("card")
      .selectAll()
      .where("card.id", "=", cardId)
      .executeTakeFirst()
      .then((card: Card) => this.convertCardToCardSelectDto(card));
  }

  public async getCardImageData(cardId: string, imageType: ImageType): Promise<CardImageSelectDto>
  {
    return this.database.selectFrom("card")
      .leftJoin("card_image", "card_image.card_id", "card.id")
      .leftJoin("card_set", "card_set.id", "card.set_id")
      .select([
        "card.collector_number as collectorNumber",
        "card_image.uri as imageUri",
        "card_set.code as setCode",
        "card.lang as language",
        "card_image.image_type as imageType"
      ])
      .where("card.id", "=", cardId)
      .where("card_image.image_type", "=", imageType)
      .executeTakeFirst();
  }

  public async getWithOptions(options: CardQueryOptions): Promise<Array<CardSelectDto>> {
    console.log(options);
    let cardQueryResult: Promise<Array<Card>>;
    if (options.cardId) {
      cardQueryResult = this.database
        .selectFrom("card")
        .selectAll()
        .where("card.id", "=", options.cardId).execute();
    }
    else if (options.setIds) {
      cardQueryResult = this.database
        .selectFrom("card")
        .selectAll()
        .leftJoin("card_set", "card_set.id", "card.set_id")
        .selectAll("card")
        .where("card.set_id", "in", options.setIds)
        .execute();
    }
    return cardQueryResult.then((cards: Array<Card>) =>
      cards.map((card: Card) => this.convertCardToCardSelectDto(card))
    );
  }

  public async sync(cards: Array<ScryfallCard>, progressCallback?: ProgressCallback): Promise<void> {
    const total = cards.length;
    let cnt = 0;
    return Promise
      .all(cards.map((card: ScryfallCard) => this.syncSingleCard(card, ++cnt, total, progressCallback)))
      .then(() => Promise.resolve());
  }

  //#endregion

  //#region private sync methods ----------------------------------------------
  private async syncSingleCard(card: ScryfallCard, cnt: number, total: number, progressCallback?: ProgressCallback): Promise<void> {
    return this.database.transaction().execute(async (trx: Transaction<DatabaseSchema>) => {
      const filter: ExpressionOrFactory<DatabaseSchema, "card", SqlBool> = (eb) => eb("card.id", "=", card.id);
      const queryExisting: Promise<{ id: string }> = trx
        .selectFrom("card")
        .select("card.id")
        .where(filter)
        .executeTakeFirst();

      const insertOrUpdate: Promise<InsertResult | UpdateResult> = queryExisting.then((queryResult: { id: string }) => {
        let result: Promise<InsertResult | UpdateResult>;
        if (queryResult) {
          if (progressCallback) {
            progressCallback(`Updating ${card.name} (${cnt}/${total})`);
          }
          result = trx.updateTable("card")
            .set(this.cardAdapter.toUpdate(card))
            .where(filter)
            .executeTakeFirstOrThrow();

        } else {
          if (progressCallback) {
            progressCallback(`Inserting ${card.name} (${cnt}/${total})`);
          }
          result = trx.insertInto("card")
            .values(this.cardAdapter.toInsert(card))
            .executeTakeFirstOrThrow();
        }
        return result;
      });

      return insertOrUpdate.then(() =>
        Promise.all([
          this.syncCardCardMap(trx, card.id, null),
          this.syncCardColorMaps(trx, card.id, "card", card.colors),
          this.syncCardColorMaps(trx, card.id, "identity", card.color_identity),
          this.syncCardColorMaps(trx, card.id, "indicator", card.color_indicator),
          this.syncCardColorMaps(trx, card.id, "produced_mana", card.color_indicator),
          this.syncCardFormatLegalities(trx, card.id, card.legalities),
          this.syncCardGame(trx, card.id, card.games),
          this.syncCardKeyword(trx, card.id, card.keywords),
          this.syncCardImages(trx, card.id, card.image_uris),
          this.syncMultiversId(trx, card.id, card.multiverse_ids),
          this.syncCardfaces(trx, card.id, card.card_faces)
        ])
      ); //.then(() => Promise.resolve())
    }).then(
      null,
      (reason) => {

        console.log(reason);
      }
    );
  }

  private async syncCardCardMap(trx: Transaction<DatabaseSchema>, cardId: string, relatedCards: Array<RelatedCard>): Promise<void> {
    if (relatedCards?.length > 0) {
      relatedCards.forEach(async (relatedCard: RelatedCard) => {
        const filter: ExpressionOrFactory<DatabaseSchema, "card_card_map", SqlBool> = (eb) => eb.and([
          eb("card_card_map.card_id", "=", cardId),
          eb("card_card_map.related_card_id", "=", relatedCard.id)
        ]);
        const existing = await trx
          .selectFrom("card_card_map")
          .select("card_card_map.card_id")
          .where(filter)
          .executeTakeFirst();

        if (existing) {
          await trx.updateTable("card_card_map")
            .set(this.cardCardMapAdapter.toUpdate(null))
            .executeTakeFirstOrThrow();
        }
        else {
          await trx.insertInto("card_card_map")
            .values(this.cardCardMapAdapter.toInsert(cardId, relatedCard.id, relatedCard))
            .executeTakeFirstOrThrow();
        }
      });
    }
  }

  private async syncCardColorMaps(trx: Transaction<DatabaseSchema>, cardId: string, colorType: CardColorType, colors: Array<Color> | null): Promise<void> {
    if (colors?.length > 0) {
      colors.forEach(async (color: Color) => {
        const filter: ExpressionOrFactory<DatabaseSchema, "card_color_map", SqlBool> = (eb) => eb.and([
          eb("card_color_map.card_id", "=", cardId),
          eb("card_color_map.color_type", "=", colorType),
          eb("card_color_map.color_id", "=", color),
        ]);
        const existing = await trx
          .selectFrom("card_color_map")
          .select("card_color_map.card_id")
          .where(filter)
          .executeTakeFirst();

        if (existing) {
          await trx.updateTable("card_color_map")
            .set(this.cardColorMapAdapter.toUpdate(null))
            .executeTakeFirstOrThrow();
        }
        else {
          await trx.insertInto("card_color_map")
            .values(this.cardColorMapAdapter.toInsert(cardId, color, colorType))
            .executeTakeFirstOrThrow();
        }
      });
    }
  }

  private async syncCardFormatLegalities(trx: Transaction<DatabaseSchema>, cardId: string, legalities: Legalities): Promise<void> {
    if (legalities) {
      Object.keys(legalities).forEach(async (key: string) => {
        await this.syncSingleCardFormatLegality(trx, cardId, key as GameFormat, legalities[key as keyof Legalities] as CardLegality);
      });
    }
  }

  private async syncSingleCardFormatLegality(trx: Transaction<DatabaseSchema>, cardId: string, format: GameFormat, legality: CardLegality): Promise<void> {
    const filter: ExpressionOrFactory<DatabaseSchema, "card_format_legality", SqlBool> = (eb) =>
      eb.and([
        eb("card_format_legality.card_id", "=", cardId),
        eb("card_format_legality.format", "=", format)
      ]
      );
    const existing = await trx.selectFrom("card_format_legality")
      .select("card_format_legality.card_id")
      .where(filter)
      .executeTakeFirst();
    if (existing) {
      await trx.updateTable("card_format_legality")
        .set(this.cardFormatLegalityAdapter.toUpdate({ format: format, legality: legality }))
        .where(filter)
        .executeTakeFirstOrThrow();
    } else {
      await trx.insertInto("card_format_legality")
        .values(this.cardFormatLegalityAdapter.toInsert(cardId, { format: format, legality: legality }))
        .executeTakeFirstOrThrow();
    }
  }

  private async syncCardGame(trx: Transaction<DatabaseSchema>, cardId: string, games: Array<(keyof typeof Game)>): Promise<void> {
    games.forEach(async (game: keyof typeof Game) => {
      const filter: ExpressionOrFactory<DatabaseSchema, "card_game", SqlBool> = (eb) =>
        eb.and([
          eb("card_game.card_id", "=", cardId),
          eb("card_game.game", "=", game)
        ]
        );
      const existing = await trx.selectFrom("card_game")
        .select("card_game.card_id")
        .where(filter)
        .executeTakeFirst();
      if (existing) {
        await trx.updateTable("card_game")
          .set(this.cardGameAdapter.toUpdate(null))
          .where(filter)
          .executeTakeFirstOrThrow();
      } else {
        await trx.insertInto("card_game")
          .values(this.cardGameAdapter.toInsert(cardId, game))
          .executeTakeFirstOrThrow();
      }
    });
  }

  private async syncCardKeyword(trx: Transaction<DatabaseSchema>, cardId: string, keywords: Array<string>): Promise<void> {
    keywords.forEach(async (keyword: string) => {
      const filter: ExpressionOrFactory<DatabaseSchema, "card_keyword", SqlBool> = (eb) =>
        eb.and([
          eb("card_keyword.card_id", "=", cardId),
          eb("card_keyword.keyword", "=", keyword)
        ]
        );
      const existing = await trx.selectFrom("card_keyword")
        .select("card_keyword.card_id")
        .where(filter)
        .executeTakeFirst();
      if (existing) {
        await trx.updateTable("card_keyword")
          .set(this.cardKeywordAdapter.toUpdate(null))
          .where(filter)
          .executeTakeFirstOrThrow();
      } else {
        await trx.insertInto("card_keyword")
          .values(this.cardKeywordAdapter.toInsert(cardId, keyword))
          .executeTakeFirstOrThrow();
      }
    });
  }

  private async syncCardImages(trx: Transaction<DatabaseSchema>, cardId: string, images: ImageUris): Promise<void> {
    if (images) {
      Object.keys(images).forEach(async (key: string) => {
        await this.syncSingleCardImage(trx, cardId, key as ImageType, images[key as keyof ImageUris] as string);
      });
    }
  }

  private async syncSingleCardImage(trx: Transaction<DatabaseSchema>, cardId: string, imageType: ImageType, uri: string): Promise<void> {
    if (uri) {
      const filter: ExpressionOrFactory<DatabaseSchema, "card_image", SqlBool> = (eb) =>
        eb.and([
          eb("card_image.card_id", "=", cardId),
          eb("card_image.image_type", "=", imageType)
        ]);
      const existing = await trx.selectFrom("card_image")
        .select("card_image.card_id")
        .where(filter)
        .executeTakeFirst();

      if (existing) {
        await trx.updateTable("card_image")
          .set(this.cardImageAdapter.toUpdate({ type: imageType, uri: uri }))
          .where(filter)
          .executeTakeFirstOrThrow();
      } else {
        await trx.insertInto("card_image")
          .values(this.cardImageAdapter.toInsert(cardId, { type: imageType, uri: uri }))
          .executeTakeFirstOrThrow();
      }
    }
  }

  private async syncMultiversId(trx: Transaction<DatabaseSchema>, cardId: string, multiverseIds: Array<number> | null): Promise<void> {
    if (multiverseIds?.length > 0) {
      multiverseIds.forEach(async (game: number) => {
        const filter: ExpressionOrFactory<DatabaseSchema, "card_multiverse_id", SqlBool> = (eb) =>
          eb.and([
            eb("card_multiverse_id.card_id", "=", cardId),
            eb("card_multiverse_id.multiverse_id", "=", game)
          ]);

        const existing = await trx.selectFrom("card_multiverse_id")
          .select("card_multiverse_id.multiverse_id")
          .where(filter)
          .executeTakeFirst();

        if (existing) {
          await trx.updateTable("card_multiverse_id")
            .set(this.cardMultiverseIdAdapter.toUpdate(null))
            .where(filter)
            .executeTakeFirstOrThrow();
        } else {
          await trx.insertInto("card_multiverse_id")
            .values(this.cardMultiverseIdAdapter.toInsert(cardId, game))
            .executeTakeFirstOrThrow();
        }
      });
    }
  }

  private async syncCardfaces(trx: Transaction<DatabaseSchema>, cardId: string, cardfaces: Array<ScryFallCardface>): Promise<void> {
    return Promise.all(cardfaces.map((cardface: ScryFallCardface) => this.syncSingleCardface(trx, cardId, cardface)))
      .then(() => Promise.resolve());
  }

  private async syncSingleCardface(trx: Transaction<DatabaseSchema>, cardId: string, cardface: ScryFallCardface): Promise<void> {
    // because cardfaces do not have a unique id, we delete the exisitng ones first, before re-creating them
    const deleteFilter: ExpressionOrFactory<DatabaseSchema, "cardface", SqlBool> = (eb) => eb("cardface.card_id", "=", cardId);
    trx.deleteFrom("cardface").where(deleteFilter).execute()
      .then(() => {
        trx.insertInto("cardface").values(this.cardfaceAdapter.toInsert(cardId, cardface)).executeTakeFirstOrThrow()
          .then((insertResult: InsertResult) => {
            trx.selectFrom("cardface").select("cardface.id").where(sql`ROWID`, "=", insertResult.insertId).executeTakeFirst()
              .then((cardfaceId: { id: string }) => {
                return Promise.all([
                  this.syncCardfaceColorMaps(trx, cardfaceId.id, "indicator", cardface.color_indicator), // found no json yet where this was set
                  this.syncCardfaceColorMaps(trx, cardfaceId.id, "card", cardface.colors),
                  this.syncCardfaceImages(trx, cardfaceId.id, cardface.image_uris)
                ]);
              });
          });
      });
    return Promise.resolve();
  }

  private async syncCardfaceColorMaps(trx: Transaction<DatabaseSchema>, cardfaceId: string, colorType: CardColorType, colors: Array<Color> | null): Promise<void> {
    if (colors?.length > 0) {
      const result: Array<Promise<InsertResult | UpdateResult>> = new Array<Promise<InsertResult | UpdateResult>>();
      colors.forEach(async (color: Color) => {
        const filter: ExpressionOrFactory<DatabaseSchema, "cardface_color_map", SqlBool> = (eb) => eb.and([
          eb("cardface_color_map.cardface_id", "=", cardfaceId),
          eb("cardface_color_map.color_type", "=", colorType),
          eb("cardface_color_map.color_id", "=", color),
        ]);
        const existing = trx
          .selectFrom("cardface_color_map")
          .select("cardface_color_map.cardface_id")
          .where(filter)
          .executeTakeFirst();

        existing.then((queryResult: { cardface_id: string }) => {
          if (queryResult) {
            result.push(trx.updateTable("cardface_color_map")
              .set(this.cardfaceColorMapAdapter.toUpdate(null))
              .executeTakeFirstOrThrow());
          }
          else {
            result.push(trx.insertInto("cardface_color_map")
              .values(this.cardfaceColorMapAdapter.toInsert(cardfaceId, color, colorType))
              .executeTakeFirstOrThrow());
          }
        });
      });
      return Promise.all(result).then(() => Promise.resolve());
    } else {
      return Promise.resolve();
    }

  }

  private async syncCardfaceImages(trx: Transaction<DatabaseSchema>, cardfaceId: string, images?: ImageUris): Promise<void> {
    const result: Array<Promise<void>> = new Array<Promise<void>>();
    if (images) {
      Object.keys(images).forEach(async (key: string) => {
        result.push(this.syncSingleCardfaceImage(trx, cardfaceId, key as ImageType, images[key as keyof ImageUris] as string));
      });
    }
    return Promise.all(result).then(() => Promise.resolve());
  }

  private async syncSingleCardfaceImage(trx: Transaction<DatabaseSchema>, cardfaceId: string, imageType: ImageType, uri: string): Promise<void> {
    if (uri) {
      const filter: ExpressionOrFactory<DatabaseSchema, "cardface_image", SqlBool> = (eb) =>
        eb.and([
          eb("cardface_image.cardface_id", "=", cardfaceId),
          eb("cardface_image.image_type", "=", imageType)
        ]);
      const existing = await trx.selectFrom("cardface_image")
        .select("cardface_image.cardface_id")
        .where(filter)
        .executeTakeFirst();

      if (existing) {
        await trx.updateTable("cardface_image")
          .set(this.cardfaceImageAdapter.toUpdate({ type: imageType, uri: uri }))
          .where(filter)
          .executeTakeFirstOrThrow();
      } else {
        await trx.insertInto("cardface_image")
          .values(this.cardfaceImageAdapter.toInsert(cardfaceId, { type: imageType, uri: uri }))
          .executeTakeFirstOrThrow();
      }
    }
  }
  //#endregion

  //#region private get related methods ---------------------------------------
  private convertCardToCardSelectDto(card: Card): CardSelectDto {
    const manaCostArray = new Array<string>();
    if (card.mana_cost?.length > 0) {
      card.mana_cost
        .split("//")
        .forEach((singleManaCost: string, idx: number) => {
          if (idx > 0) {
            manaCostArray.push("//");
          }
          manaCostArray.push(...this.convertSingleManaCostToArray(singleManaCost.trim()));
        });
    }
    return {
      card: card,
      manaCostArray: manaCostArray,
      collectorNumberSortValue: isNaN(Number(card.collector_number)) ? card.collector_number : card.collector_number.padStart(3, "0")
    };
  }

  private convertSingleManaCostToArray(manaCost: string): Array<string> {
    const splittedCellValue = manaCost.split("}");
    splittedCellValue.pop();
    return splittedCellValue.map((s: string, i: number) => i < splittedCellValue.length ? s + "}" : s);
  }
  //#endregion
}
