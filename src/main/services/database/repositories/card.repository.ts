import { Card as ScryfallCard } from "scryfall-sdk";
import { inject, injectable } from "tsyringe";
import TOKENS from "../../tokens";
import { IDatabaseService } from "../database.service";
import { BaseRepository } from "./base.repository";

export interface ICardRepository {
  sync(cardSets: Array<ScryfallCard>): Promise<void>;
}

@injectable()
export class CardRepository extends BaseRepository implements ICardRepository {

  public constructor(@inject(TOKENS.DatabaseService) databaseService: IDatabaseService) {
    super(databaseService);
  }

  // TODO remove items that are not on the server anymore or at least mark them
  public async sync(_cardSets: Array<ScryfallCard>): Promise<void> {
    throw new Error("Sync not implemented");
  }
}
