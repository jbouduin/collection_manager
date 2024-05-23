import * as fs from "fs";
import * as helpers from "kysely/helpers/sqlite";
import { inject, injectable } from "tsyringe";

import { CardImageDto, DtoCard, DtoCardface, OracleDto } from "../../../../common/dto";
import { ImageSize } from "../../../../common/enums";
import { CardQueryOptions } from "../../../../common/ipc-params/query/card-query.options";
import { cardTableFields, cardfaceTableFields } from "../../../../main/database/schema/card/table-fields.constants";
import { oracleTableFields } from "../../../../main/database/schema/oracle/table-field.constants";
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
  public async getCardImageData(cardfaceId: string, imageType: ImageSize): Promise<CardImageDto> {
    return this.database.selectFrom("cardface_image")
      .innerJoin("cardface", "cardface.id", "cardface_image.cardface_id")
      .innerJoin("card", "card.id", "cardface.card_id")
      .innerJoin("card_set", "card_set.id", "card.set_id")
      .select([
        "card.collector_number as collectorNumber",
        "cardface_image.uri as imageUri",
        "card_set.code as setCode",
        "card.lang as language",
        "cardface_image.image_type as imageType"
        // LATER sql`${imageType} as imageType`
      ])
      .where("cardface.id", "=", cardfaceId)
      .where("cardface_image.image_type", "=", imageType)
      .executeTakeFirst();
  }

  public async getCards(options: CardQueryOptions): Promise<Array<DtoCard>>{
    return await this.database
      .selectFrom("card")
      .innerJoin("card_set", "card_set.id", "card.set_id")
      .select((eb) => [
        ...cardTableFields,
        helpers.jsonArrayFrom<DtoCardface>(
          eb.selectFrom("cardface")
            .select(cardfaceTableFields)
            .whereRef("cardface.card_id", "=", "card.id")
            .$castTo<DtoCardface>()
        ).as("cardfaces"),
        helpers.jsonObjectFrom<OracleDto>(
          eb.selectFrom("oracle")
            .select(oracleTableFields)
            .whereRef("oracle.oracle_id", "=", "card.oracle_id")
            .$castTo<OracleDto>()
        ).as("oracle")
      ])
      .where("card.set_id", "in", options.setIds)
      .where("card.lang", "=", "en")
      // .$call(this.logCompilable)
      .$castTo<DtoCard>()
      .execute()
      .then((qryResult: Array<DtoCard>) => {
        qryResult.forEach((card: DtoCard) => {
          card.collectorNumberSortValue = isNaN(Number(card.collector_number)) ? card.collector_number : card.collector_number.padStart(3, "0");
          card.cardfaces.forEach((cardFace: DtoCardface) => cardFace.manaCostArray = this.convertManaCostToArray(cardFace.mana_cost));
        });
        fs.writeFileSync("c:/data/new-assistant/json/cardquery.json", JSON.stringify(qryResult, null, 2));
        return qryResult;
      });
  }

  //#endregion

  //#region private methods ---------------------------------------------------
  private convertManaCostToArray(manaCost: string): Array<string> {
    const splittedCellValue = manaCost.split("}");
    splittedCellValue.pop();
    return splittedCellValue.map((s: string, i: number) => i < splittedCellValue.length ? s + "}" : s);
  }
  //#endregion
}
