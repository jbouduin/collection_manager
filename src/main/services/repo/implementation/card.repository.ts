import { Selectable } from "kysely";
import { inject, injectable } from "tsyringe";

import { CardDto, CardImageDto, CardfaceDto, } from "../../../../common/dto";
import { ImageSize } from "../../../../common/enums";
import { CardQueryOptions } from "../../../../common/ipc-params/query/card-query.options";
import { CardFaceColorMapTable, CardFaceLocalizationTable, CardTable, CardfaceTable, OracleTable } from "../../../../main/database/schema";
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
  public async getCardImageData(localizationId: string, imageType: ImageSize): Promise<CardImageDto> {
    return this.database.selectFrom("cardface_localization")
      .innerJoin("cardface", "cardface.id", "cardface_localization.cardface_id")
      .innerJoin("card", "card.id", "cardface.card_id")
      .innerJoin("card_set", "card_set.id", "card.set_id")
      .innerJoin("cardface_localization_image", "cardface_localization_image.cardface_localization_id", "cardface_localization.id")
       .select([
         "card.collector_number as collectorNumber",
         "cardface_localization_image.uri as imageUri",
         "card_set.code as setCode",
         "cardface_localization.lang as language",
         "cardface_localization_image.image_type as imageType"
         // LATER sql`${imageType} as imageType`
       ])
       .where("cardface_localization.id", "=", localizationId)
       .where("cardface_localization_image.image_type", "=", imageType)
       .executeTakeFirst();
  }

  public async getCards(options: CardQueryOptions): Promise<Array<CardDto>> {
    console.log(options);
    const languages = options.languages ?? ["en"];
    let cardQueryResult: Promise<Array<Selectable<CardTable>>>;
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
    const cards = await cardQueryResult;
    const oracles = await this.database
      .selectFrom("oracle")
      .selectAll()
      .where("oracle.oracle_id", "in", cards.map((card: Selectable<CardTable>) => card.oracle_id))
      .execute();
    const cardfaces = await this.database
      .selectFrom("cardface")
      .selectAll()
      .where("cardface.card_id", "in", cards.map((card: Selectable<CardTable>) => card.id))
      .execute();
    const localizations = await this.database
      .selectFrom("cardface_localization")
      .selectAll()
      .where("cardface_localization.cardface_id", "in", cardfaces.map((cardface: Selectable<CardfaceTable>) => cardface.id))
      .where("cardface_localization.lang", "in", languages)
      .execute();
    return await this.database
      .selectFrom("cardface_color_map")
      .selectAll()
      .where("cardface_color_map.cardface_id", "in", cardfaces.map((cardface: Selectable<CardfaceTable>) => cardface.id))
      .execute()
      .then((colorMaps: Array<Selectable<CardFaceColorMapTable>>) =>
        this.createCardDtos(cards, oracles, cardfaces, localizations, colorMaps));



  }
  //#endregion

  //#region private get related methods ---------------------------------------
  private createCardDtos(
    cards: Array<Selectable<CardTable>>,
    oracles: Array<Selectable<OracleTable>>,
    cardfaces: Array<Selectable<CardfaceTable>>,
    localizations: Array<Selectable<CardFaceLocalizationTable>>,
    colorMaps: Array<Selectable<CardFaceColorMapTable>>): Array<CardDto> {
    return cards.map((card: Selectable<CardTable>) => {
      const result: CardDto = {
        card: card,
        oracle: oracles.filter((oracle: Selectable<OracleTable>) => oracle.oracle_id == card.oracle_id)[0],
        cardfaces: this.createCardfaceDtos(card.id, cardfaces, localizations, colorMaps),
        collectorNumberSortValue: isNaN(Number(card.collector_number)) ? card.collector_number : card.collector_number.padStart(3, "0")
      };
      return result;
    });
  }

  private createCardfaceDtos(
    cardId: string,
    cardfaces: Array<Selectable<CardfaceTable>>,
    localizations: Array<Selectable<CardFaceLocalizationTable>>,
    colorMaps: Array<Selectable<CardFaceColorMapTable>>): Array<CardfaceDto>  {
    return cardfaces
      .filter((cardface: Selectable<CardfaceTable>) => cardface.card_id == cardId)
      .map((cardface: Selectable<CardfaceTable>) => {
        const result: CardfaceDto = {
          cardface: cardface,
          localizations: localizations.filter((localization: Selectable<CardFaceLocalizationTable>) => localization.cardface_id == cardface.id),
          colorMaps: colorMaps.filter((colorMap: Selectable<CardFaceColorMapTable>) => colorMap.cardface_id = cardface.id),
          manaCostArray: this.convertManaCostToArray(cardface.mana_cost)
        };
        return result;
      });
  }

  private convertManaCostToArray(manaCost: string): Array<string> {
    const splittedCellValue = manaCost.split("}");
    splittedCellValue.pop();
    return splittedCellValue.map((s: string, i: number) => i < splittedCellValue.length ? s + "}" : s);
  }
  //#endregion
}
