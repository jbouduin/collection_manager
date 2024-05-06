import { ExpressionOrFactory, SqlBool, Transaction } from "kysely";
import { Color, Game, ImageUris, Legalities, RelatedCard, Card as ScryfallCard } from "scryfall-sdk";
import { inject, injectable } from "tsyringe";

import { CardColorType, CardLegality, GameFormat, ImageType } from "../../../../common/enums";
import { DatabaseSchema, Card } from "../../../../main/database/schema";
import INFRATOKENS, { IDatabaseService } from "../../infra/interfaces";
import { ICardRepository } from "../interfaces";
import { BaseRepository } from "./base.repository";
import ADAPTTOKENS, { ICardAdapter, ICardCardMapAdapter, ICardColorMapAdapter, ICardFormatLegalityAdapter, ICardGameAdapter, ICardImageAdapter, ICardMultiverseIdAdapter } from "../../adapt/interfaces";


@injectable()
export class CardRepository extends BaseRepository implements ICardRepository {

  //#region Private readonly properties ---------------------------------------
  private cardCardMapAdapter: ICardCardMapAdapter;
  private cardColorMapAdapter: ICardColorMapAdapter;
  private cardFormatLegalityAdapter: ICardFormatLegalityAdapter;
  private cardGameAdapter: ICardGameAdapter;
  private cardImageAdapter: ICardImageAdapter;
  private cardAdapter: ICardAdapter;
  private cardMultiverseIdAdapter: ICardMultiverseIdAdapter;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(
    @inject(INFRATOKENS.DatabaseService) databaseService: IDatabaseService,
    @inject(ADAPTTOKENS.CardCardMapAdapter) cardCardMapAdapter: ICardCardMapAdapter,
    @inject(ADAPTTOKENS.CardColorMapAdapter) cardColorMapAdapter: ICardColorMapAdapter,
    @inject(ADAPTTOKENS.CardFormatLegalityAdapter) cardFormatLegalityAdapter: ICardFormatLegalityAdapter,
    @inject(ADAPTTOKENS.CardGameAdapter) cardGameAdapter: ICardGameAdapter,
    @inject(ADAPTTOKENS.CardImageAdapter) cardImageAdapter: ICardImageAdapter,
    @inject(ADAPTTOKENS.CardMultiverseIdAdapter) cardMultiverseIdAdapter: ICardMultiverseIdAdapter,
    @inject(ADAPTTOKENS.CardAdapter) cardAdapter: ICardAdapter,
  ) {
    super(databaseService);
    this.cardCardMapAdapter = cardCardMapAdapter;
    this.cardColorMapAdapter = cardColorMapAdapter;
    this.cardFormatLegalityAdapter = cardFormatLegalityAdapter;
    this.cardGameAdapter = cardGameAdapter;
    this.cardImageAdapter = cardImageAdapter;
    this.cardMultiverseIdAdapter = cardMultiverseIdAdapter;
    this.cardAdapter = cardAdapter;
  }
  //#endregion

  //#region ICardRepository methods -------------------------------------------
  public async getCardById(cardId: string): Promise<Card> {
    return this.database.selectFrom("card").selectAll().where("card.id", "=", cardId).executeTakeFirst();
  }

  // TODO remove items that are not on the server anymore or at least mark them
  public async sync(cards: Array<ScryfallCard>): Promise<void> {
    console.log("start CardRepository.sync:");
    return this.database.transaction().execute(async (trx: Transaction<DatabaseSchema>) => {
      cards.forEach(async (card: ScryfallCard) => {
        console.log("  -> start sync card", card.name);
        await this.syncCard(trx, card).then(async () => {
          // TODO next line pass real value card.all_parts when table is created in migration script and we know how to handle missing related cards
          await this.syncCardCardMap(trx, card.id, null);
          await this.syncCardColorMap(trx, card.id, "card", card.colors);
          await this.syncCardColorMap(trx, card.id, "identity", card.color_identity);
          await this.syncCardColorMap(trx, card.id, "indicator", card.color_indicator);
          await this.syncCardColorMap(trx, card.id, "produced_mana", card.color_indicator);
          await this.syncCardFormatLegalities(trx, card.id, card.legalities);
          await this.syncCardGame(trx, card.id, card.games);
          await this.syncCardImages(trx, card.id, card.image_uris);
          console.log("    -> start sync card_multiverse_id");
          await this.syncMultiversId(trx, card.id, card.multiverse_ids);
        });
      });
    });
  }

  //#endregion

  //#region private sync methods ----------------------------------------------
  private async syncCard(trx: Transaction<DatabaseSchema>, card: ScryfallCard): Promise<void> {
    const filter: ExpressionOrFactory<DatabaseSchema, "card", SqlBool> = (eb) => eb("card.id", "=", card.id);
    const existing: { id: string } = await trx
      .selectFrom("card")
      .select("card.id")
      .where(filter)
      .executeTakeFirst();

    if (existing) {
      await trx.updateTable("card")
        .set(this.cardAdapter.toUpdate(card))
        .where(filter)
        .executeTakeFirstOrThrow();

    } else {
      await trx.insertInto("card")
        .values(this.cardAdapter.toInsert(card))
        .executeTakeFirstOrThrow();
    }
  }

  private async syncCardCardMap(trx: Transaction<DatabaseSchema>, cardId: string, relatedCards: Array<RelatedCard>): Promise<void> {
    // TODO have to fetch the related cards, otherwise we can not create the map or we store the id without any additional data and give the record a state
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

  private async syncCardColorMap(trx: Transaction<DatabaseSchema>, cardId: string, colorType: CardColorType, colors: Array<Color> | null): Promise<void> {
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
  //#endregion
}
