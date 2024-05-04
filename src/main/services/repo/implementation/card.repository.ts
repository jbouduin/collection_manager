import { Card as ScryfallCard } from "scryfall-sdk";
import { inject, injectable } from "tsyringe";
import INFRATOKENS, { IDatabaseService } from "../../infra/interfaces";
import { ICardRepository } from "../interfaces";
import { BaseRepository } from "./base.repository";


@injectable()
export class CardRepository extends BaseRepository implements ICardRepository {

  public constructor(@inject(INFRATOKENS.DatabaseService) databaseService: IDatabaseService) {
    super(databaseService);
  }

  // TODO remove items that are not on the server anymore or at least mark them
  public async sync(_cardSets: Array<ScryfallCard>): Promise<void> {
    throw new Error("Sync not implemented");
  }
}
