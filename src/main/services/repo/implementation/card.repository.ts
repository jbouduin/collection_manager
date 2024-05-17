import { inject, injectable } from "tsyringe";

import { CardDto, CardImageDto, } from "../../../../common/dto";
import { ImageType } from "../../../../common/enums";
import { CardQueryOptions } from "../../../../common/ipc-params/card-query.options";
import { Card } from "../../../../main/database/schema";
import INFRATOKENS, { IDatabaseService } from "../../infra/interfaces";
import { ICardRepository } from "../interfaces";
import { BaseRepository } from "./base.repository";


@injectable()
export class CardRepository extends BaseRepository implements ICardRepository {

  //#region Constructor & C° --------------------------------------------------
  public constructor(
    @inject(INFRATOKENS.DatabaseService) databaseService: IDatabaseService) {
    super(databaseService);
  }
  //#endregion

  //#region ICardRepository methods -------------------------------------------
  public async getCardById(cardId: string): Promise<CardDto> {
    return this.database
      .selectFrom("card")
      .selectAll()
      .where("card.id", "=", cardId)
      .executeTakeFirst()
      .then((card: Card) => this.convertCardToCardSelectDto(card));
  }

  public async getCardImageData(cardId: string, imageType: ImageType): Promise<CardImageDto> {
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

  public async getWithOptions(options: CardQueryOptions): Promise<Array<CardDto>> {
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
  //#endregion

  //#region private get related methods ---------------------------------------
  private convertCardToCardSelectDto(card: Card): CardDto {
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
