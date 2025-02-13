import { inject, injectable } from "tsyringe";
import * as helpers from "kysely/helpers/sqlite";

import { DtoCardSet, DtoCardSetDetails, DtoCardSetLanguage } from "../../../../common/dto";
import INFRATOKENS, { IDatabaseService, IImageCacheService } from "../../infra/interfaces";
import { ICardSetRepository } from "../interfaces";
import { BaseRepository } from "./base.repository";
import { cardSetTableFields } from "../../../database/schema/card/table-fields.constants";
import { sql } from "kysely";

@injectable()
export class CardSetRepository extends BaseRepository implements ICardSetRepository {
  //#region private readonly fields -------------------------------------------
  private readonly imageCacheService: IImageCacheService;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(
    @inject(INFRATOKENS.DatabaseService) databaseService: IDatabaseService,
    @inject(INFRATOKENS.ImageCacheService) imageCacheService: IImageCacheService) {
    super(databaseService);
    this.imageCacheService = imageCacheService;
  }
  //#endregion

  //#region ICardSetRepository methods ----------------------------------------
  /* eslint-disable @stylistic/function-paren-newline */
  public getAll(): Promise<Array<DtoCardSet>> {
    return this.database
      .selectFrom("card_set")
      .selectAll()
      .$castTo<DtoCardSet>()
      .execute()
      .then((qryResult: Array<DtoCardSet>) => {
        qryResult.forEach((cardSet: DtoCardSet) => cardSet.svg = this.imageCacheService.getCardSetSvg(cardSet));
        return qryResult;
      });
  }

  public getDetails(cardSetId: string): Promise<DtoCardSetDetails> {
    return this.database
      .selectFrom("card_set")
      .select((eb) => [
        ...cardSetTableFields,
        helpers.jsonArrayFrom<DtoCardSetLanguage>(
          eb.selectFrom("card")
            .select((eb) => ["card.lang", eb.fn.count("card.id").as("number_of_cards")])
            // .distinctOn("card.lang")
            .groupBy("card.lang")
            .whereRef("card.set_id", "=", "card_set.id")
            .innerJoin("language", "language.id", "card.lang")
            .orderBy("language.sequence")
            .$castTo<DtoCardSetLanguage>()
        ).as("languages"),
        eb.selectFrom("card as c2")
          .select((eb) => eb.fn.count(sql`DISTINCT c2.oracle_id`).as("unique_cards"))
          .whereRef("c2.set_id", "=", "card_set.id")
          .as("unique_cards")
      ])
      .where("card_set.id", "=", cardSetId)
      // .$call(this.logCompilable)
      .$castTo<DtoCardSetDetails>()
      .executeTakeFirst();
  }
  //#endregion
}
