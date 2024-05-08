import { ExpressionOrFactory, SqlBool, Transaction } from "kysely";
import { Set as ScryfallSet } from "scryfall-sdk";
import { inject, injectable } from "tsyringe";

import { CardSetSelectDto } from "../../../../common/dto";
import { DatabaseSchema } from "../../../database/schema";
import ADAPTTOKENS, { ICardSetAdapter } from "../../adapt/interfaces";
import INFRATOKENS, { IDatabaseService } from "../../infra/interfaces";
import { ICardSetRepository } from "../interfaces";
import { BaseRepository } from "./base.repository";

@injectable()
export class CardSetRepository extends BaseRepository implements ICardSetRepository {

  //#region private readonly properties ---------------------------------------
  private cardSetAdapter: ICardSetAdapter;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(
    @inject(INFRATOKENS.DatabaseService) databaseService: IDatabaseService,
    @inject(ADAPTTOKENS.CardSetAdapter) cardSetAdapter: ICardSetAdapter) {
    super(databaseService);
    this.cardSetAdapter = cardSetAdapter;
  }
  //#endregion

  //#region ICardSetRepository methods ----------------------------------------
  public getAll(): Promise<Array<CardSetSelectDto>> {
    return this.database
      .selectFrom("card_set")
      .selectAll()
      .execute();
  }

  // TODO remove items that are not on the server anymore or at least mark them => how ?
  // then we should prevent synchronizing single sets !
  public async sync(cardSets: Array<ScryfallSet>): Promise<void> {
    return this.database.transaction().execute(async (trx: Transaction<DatabaseSchema>) => {
      cardSets.forEach(async (cardSet: ScryfallSet) => {
        const filter: ExpressionOrFactory<DatabaseSchema, "card_set", SqlBool> = (eb) => eb("card_set.id", "=", cardSet.id);

        const existingCardSet = await trx
          .selectFrom("card_set")
          .select("card_set.id")
          .where(filter)
          .executeTakeFirst();
        if (existingCardSet) {
          await trx.updateTable("card_set")
            .set(this.cardSetAdapter.toUpdate(cardSet))
            .where(filter)
            .executeTakeFirstOrThrow();
        } else {
          await trx.insertInto("card_set")
            .values(this.cardSetAdapter.toInsert(cardSet))
            .executeTakeFirstOrThrow();
        }
      });
    });
  }
  //#endregion
}
