import * as fs from "fs";
import * as helpers from "kysely/helpers/sqlite";
import { inject, injectable } from "tsyringe";

import { CardImageDto, DtoCard, DtoCardColor, DtoCardface, DtoCardfaceColor, DtoOracle } from "../../../../common/dto";
import { ImageSize } from "../../../../common/enums";
import { CardQueryOptions } from "../../../../common/ipc-params/query/card-query.options";
import { cardColorMapTableFields, cardTableFields, cardfaceColorMapTableFields, cardfaceTableFields } from "../../../../main/database/schema/card/table-fields.constants";
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
  public async getCardImageData(cardId: string, sequence: number, imageType: ImageSize): Promise<CardImageDto> {
    return this.database.selectFrom("cardface_image")
      .innerJoin("card", "card.id", "cardface_image.card_id")
      .innerJoin("card_set", "card_set.id", "card.set_id")
      .select([
        "card.collector_number as collectorNumber",
        "cardface_image.uri as imageUri",
        "card_set.code as setCode",
        "card.lang as language",
        "cardface_image.image_type as imageType",
        "cardface_image.sequence as sequence"
        // LATER sql`${imageType} as imageType`
      ])
      .where("cardface_image.card_id", "=", cardId)
      .where("cardface_image.sequence", "=", sequence)
      .where("cardface_image.image_type", "=", imageType)
      // .$call(this.logCompilable)
      .executeTakeFirst();
  }

  public async getCards(options: CardQueryOptions): Promise<Array<DtoCard>> {
    return await this.database
      .selectFrom("card")
      .select((eb) => [
        ...cardTableFields,
        helpers.jsonArrayFrom<DtoCardface>(
          eb.selectFrom("cardface")
            .select((eb) => [
              ...cardfaceTableFields,
              helpers.jsonArrayFrom<DtoCardfaceColor>(
                eb.selectFrom("cardface_color_map")
                  .select(cardfaceColorMapTableFields)
                  .whereRef("cardface_color_map.card_id", "=", "cardface.card_id")
                  .whereRef("cardface_color_map.sequence", "=", "cardface.sequence")
                  .$castTo<DtoCardfaceColor>()
              ).as("cardfaceColors"),
              helpers.jsonObjectFrom<DtoOracle>(
                eb.selectFrom("oracle")
                  .select(oracleTableFields)
                  .whereRef("oracle.oracle_id", "=", "cardface.oracle_id")
                  .$castTo<DtoOracle>()
              ).as("oracle")
            ])
            .whereRef("cardface.card_id", "=", "card.id")
            .$castTo<DtoCardface>()
        ).as("cardfaces"),
        helpers.jsonArrayFrom<DtoOracle>(
          eb.selectFrom("oracle")
            .select(oracleTableFields)
            .whereRef("oracle.oracle_id", "=", "card.oracle_id")
            .$castTo<DtoOracle>()
        ).as("oracle"),
        helpers.jsonArrayFrom(
          eb.selectFrom("card as c2")
            .select(["c2.lang", "c2.id"])
            .whereRef("c2.set_id", "=", "card.set_id")
            .whereRef("c2.collector_number", "=", "card.collector_number")
            .innerJoin("language", "language.id", "c2.lang")
            .orderBy("language.sequence")
        ).as("languages"),
        helpers.jsonArrayFrom<DtoCardColor>(
          eb.selectFrom("card_color_map")
            .select(cardColorMapTableFields)
            .whereRef("card_color_map.card_id", "=", "card.id")
            .$castTo<DtoCardColor>()
        ).as("cardColors"),
      ])
      .$if(options.setIds?.length > 0, (qb) => qb.where("card.set_id", "in", options.setIds))
      .$if(options.cardId !== null && options.cardId !== undefined, (qb) => qb.where("card.id", "=", options.cardId))
      // .$call(this.logCompilable)
      .$castTo<DtoCard>()
      .groupBy(["card.set_id", "card.collector_number"])
      .orderBy(["card.set_id", "card.collector_number"])
      .execute()
      .then((qryResult: Array<DtoCard>) => {
        fs.writeFileSync("c:/data/new-assistant/json/cardquery.json", JSON.stringify(qryResult, null, 2));
        return qryResult;
      });
  }
  //#endregion
}
