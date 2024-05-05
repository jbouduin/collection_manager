import { Transaction } from "kysely";
import { Color, Game, Legalities, RelatedCard, Card as ScryfallCard } from "scryfall-sdk";
import { inject, injectable } from "tsyringe";

import { CardColorType } from "../../../../common/enums";
import { DatabaseSchema } from "../../../../main/database/schema";
import INFRATOKENS, { IDatabaseService } from "../../infra/interfaces";
import { ICardRepository } from "../interfaces";
import { BaseRepository } from "./base.repository";


@injectable()
export class CardRepository extends BaseRepository implements ICardRepository {

  public constructor(@inject(INFRATOKENS.DatabaseService) databaseService: IDatabaseService) {
    super(databaseService);
  }

  // TODO remove items that are not on the server anymore or at least mark them
  public async sync(cards: Array<ScryfallCard>): Promise<void> {
    this.database.transaction().execute(async (trx: Transaction<DatabaseSchema>) => {
      cards.forEach(async (card: ScryfallCard) => {
        await this.syncCard(trx, card);
        await this.syncCardCardMap(trx, card.id, card.all_parts);
        await this.syncCardColorMap(trx, card.id, "card", card.colors);
        await this.syncCardColorMap(trx, card.id, "identity", card.color_identity);
        await this.syncCardColorMap(trx, card.id, "indicator", card.color_indicator);
        await this.syncCardColorMap(trx, card.id, "produced_mana", card.color_indicator);
        await this.syncFormatLegality(trx, card.id, card.legalities);
        await this.syncCardGame(trx, card.id, card.games);
        await this.syncMultiversId(trx, card.id, card.multiverse_ids);
        await this.syncRulingMap(trx, card.id);
      });
    });
  }

  private async syncCard(trx: Transaction<DatabaseSchema>, card: ScryfallCard): Promise<void> {
    const existingCard: { id: string } = await trx
      .selectFrom("card")
      .select("card.id")
      .where("card.id", "=", card.id)
      .executeTakeFirst();

    if (existingCard) {

    } else {

    }

  }

  private async syncCardCardMap(trx: Transaction<DatabaseSchema>, cardId: string, relatedCards: Array<RelatedCard>): Promise<void> {
    return Promise.reject("Method not Implemented");
  }

  private async syncCardColorMap(trx: Transaction<DatabaseSchema>, cardId: string, colorType: CardColorType, colors: Array<Color> | null): Promise<void> {
    return Promise.reject("Method not Implemented");
  }

  private async syncFormatLegality(trx: Transaction<DatabaseSchema>, cardId: string, legalities: Legalities): Promise<void> {
    return Promise.reject("Method not Implemented");
  }

  private async syncCardGame(trx: Transaction<DatabaseSchema>, cardId: string, games: Array<(keyof typeof Game)>): Promise<void> {
    return Promise.reject("Method not Implemented");
  }

  private async syncMultiversId(trx: Transaction<DatabaseSchema>, cardId: string, multiverseIds: Array<number> | null): Promise<void> {
    return Promise.reject("Method not Implemented");
  }

  private async syncRulingMap(trx: Transaction<DatabaseSchema>, cardId: string,): Promise<void> {
    // TODO have to fetch the rulings, otherwise we can not create the map or we store the id without any additional data and give the record a state
    return Promise.resolve();
  }

}
