import { Transaction } from "kysely";
import { Set as ScryfallSet } from "scryfall-sdk";
import { inject, injectable } from "tsyringe";

import { DatabaseSchema } from "../../../database/schema";
import ADAPTTOKENS, { ICardSetAdapter } from "../../adapt/interfaces";
import INFRATOKENS, { IDatabaseService } from "../../infra/interfaces";
import { ICardSetRepository } from "../interfaces";
import { BaseRepository } from "./base.repository";

@injectable()
export class CardSetRepository extends BaseRepository implements ICardSetRepository {

  private cardSetAdapter: ICardSetAdapter;

  public constructor(
    @inject(INFRATOKENS.DatabaseService) databaseService: IDatabaseService,
    @inject(ADAPTTOKENS.CardSetAdapter) cardSetAdapter: ICardSetAdapter) {
    super(databaseService);
    this.cardSetAdapter = cardSetAdapter;
  }

  // TODO remove items that are not on the server anymore or at least mark them => how ?
  // then we should prevent synchronizing single sets !
  public async sync(cardSets: Array<ScryfallSet>): Promise<void> {
    await this.database.transaction().execute(async (trx: Transaction<DatabaseSchema>) => {
      cardSets.forEach(async (cardSet: ScryfallSet) => {
        const existingCardSet = await trx
          .selectFrom("card_set")
          .select("card_set.id")
          .where("card_set.id", "=", cardSet.id)
          .executeTakeFirst();
        if (existingCardSet) {
          await trx.updateTable("card_set")
            .set(this.cardSetAdapter.toUpdate(cardSet))
            .where("card_set.id", "=", cardSet.id)
            .executeTakeFirstOrThrow()
            .catch((reason) => console.log(reason));
        } else {
          await trx.insertInto("card_set")
            .values(this.cardSetAdapter.toInsert(cardSet))
            .executeTakeFirstOrThrow()
            .catch((reason) => console.log(reason));
        }
      });
    });
  }
}
