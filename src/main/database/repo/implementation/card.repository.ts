import * as fs from "fs";
import * as helpers from "kysely/helpers/sqlite";
import { inject, injectable } from "tsyringe";
import { CardDto, CardColorDto, DtoCardImageData, DtoCardface, CardfaceColorDto, DtoOracle } from "../../../../common/dto";
import { IResult } from "../../../services/base";
import { IDatabaseService, ILogService, IResultFactory } from "../../../services/infra/interfaces";
import { INFRASTRUCTURE } from "../../../services/service.tokens";
import { cardColorMapTableFields, cardTableFields, cardfaceColorMapTableFields, cardfaceTableFields } from "../../schema/card/table-fields.constants";
import { oracleTableFields } from "../../schema/oracle/table-field.constants";
import { ICardRepository } from "../interfaces";
import { BaseRepository } from "./base.repository";


@injectable()
export class CardRepository extends BaseRepository implements ICardRepository {
  //#region Constructor & C° --------------------------------------------------
  public constructor(
    @inject(INFRASTRUCTURE.DatabaseService) databaseService: IDatabaseService,
    @inject(INFRASTRUCTURE.LogService) logService: ILogService,
    @inject(INFRASTRUCTURE.ResultFacotry) resultFactory: IResultFactory
  ) {
    super(databaseService, logService, resultFactory);
  }
  //#endregion

  //#region ICardRepository methods -------------------------------------------
  public async getCardImageData(cardId: string): Promise<IResult<DtoCardImageData>> {
    try {
      return this.database.selectFrom("card")
        .innerJoin("card_set", "card_set.id", "card.set_id")
        .select([
          "card.id as cardId",
          "card.collector_number as collectorNumber",
          "card.card_back_id as cardBackId",
          "card_set.code as setCode",
          "card.lang as language"
        ])
        .where("card.id", "=", cardId)
        .$castTo<DtoCardImageData>()
        // .$call(this.logCompilable)
        .executeTakeFirst()
        .then((r: DtoCardImageData) => {
          return r != undefined
            ? this.resultFactory.createSuccessResult<DtoCardImageData>(r)
            : this.resultFactory.createNotFoundResult<DtoCardImageData>("card(s)");
        });
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<DtoCardImageData>(err);
    }
  }

  /* eslint-disable @stylistic/function-paren-newline */
  public async getCards(cardId?: string, setIds?: Array<string>): Promise<IResult<Array<CardDto>>> {
    try {
      return await this.database
        .selectFrom("card")
        .select((eb) => [
          ...cardTableFields,
          helpers.jsonArrayFrom<DtoCardface>(
            eb.selectFrom("cardface")
              .select((eb) => [
                ...cardfaceTableFields,
                helpers.jsonArrayFrom<CardfaceColorDto>(
                  eb.selectFrom("cardface_color_map")
                    .select(cardfaceColorMapTableFields)
                    .whereRef("cardface_color_map.card_id", "=", "cardface.card_id")
                    .whereRef("cardface_color_map.sequence", "=", "cardface.sequence")
                    .$castTo<CardfaceColorDto>()
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
          helpers.jsonArrayFrom<CardColorDto>(
            eb.selectFrom("card_color_map")
              .innerJoin("color", "color.id", "card_color_map.color_id")
              .select([...cardColorMapTableFields, "color.mana_symbol"])
              .whereRef("card_color_map.card_id", "=", "card.id")
              .$castTo<CardColorDto>()
          ).as("cardColors")
        ])
        .$if(setIds?.length > 0, (qb) => qb.where("card.set_id", "in", setIds))
        .$if(cardId !== null && cardId !== undefined, (qb) => qb.where("card.id", "=", cardId))
        // .$call(this.logCompilable)
        .$castTo<CardDto>()
        .groupBy(["card.set_id", "card.collector_number"])
        .orderBy(["card.set_id", "card.collector_number"])
        .execute()
        .then((qryResult: Array<CardDto>) => {
          fs.writeFileSync("c:/data/new-assistant/json/cardquery.json", JSON.stringify(qryResult, null, 2));
          return this.resultFactory.createSuccessResult<Array<CardDto>>(qryResult);
        });
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<Array<CardDto>>(err);
    }
  }
  //#endregion
}
