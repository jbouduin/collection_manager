import { sql } from "kysely";
import * as helpers from "kysely/helpers/sqlite";
import { inject, injectable } from "tsyringe";
import { MtgCardSetDetailsDto, MtgCardSetDto, MtgCardSetLanguageDto } from "../../../../common/dto";
import { IResult } from "../../../services/base";
import { IDatabaseService, IImageCacheService, ILogService, IResultFactory } from "../../../services/infra/interfaces";
import { INFRASTRUCTURE } from "../../../services/service.tokens";
import { CARD_SET_TABLE_FIELDS } from "../../schema";
import { ICardSetRepository } from "../interfaces";
import { BaseRepository } from "./base.repository";


@injectable()
export class CardSetRepository extends BaseRepository implements ICardSetRepository {
  //#region private readonly fields -------------------------------------------
  private readonly imageCacheService: IImageCacheService;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(
    @inject(INFRASTRUCTURE.DatabaseService) databaseService: IDatabaseService,
    @inject(INFRASTRUCTURE.ImageCacheService) imageCacheService: IImageCacheService,
    @inject(INFRASTRUCTURE.LogService) logService: ILogService,
    @inject(INFRASTRUCTURE.ResultFacotry) resultFactory: IResultFactory
  ) {
    super(databaseService, logService, resultFactory);
    this.imageCacheService = imageCacheService;
  }
  //#endregion

  //#region ICardSetRepository methods ----------------------------------------
  /* eslint-disable @stylistic/function-paren-newline */
  public getAll(): Promise<IResult<Array<MtgCardSetDto>>> {
    try {
      return this.database
        .selectFrom("card_set")
        .selectAll()
        .$castTo<MtgCardSetDto>()
        .execute()
        .then((qryResult: Array<MtgCardSetDto>) => {
          qryResult.forEach((cardSet: MtgCardSetDto) => cardSet.svg = this.imageCacheService.getCardSetSvg(cardSet));
          return this.resultFactory.createSuccessResult(qryResult);
        });
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<Array<MtgCardSetDto>>(err);
    }
  }

  public getDetails(cardSetId: string): Promise<IResult<MtgCardSetDetailsDto>> {
    try {
      return this.database
        .selectFrom("card_set")
        .select((eb) => [
          ...CARD_SET_TABLE_FIELDS,
          helpers.jsonArrayFrom<MtgCardSetLanguageDto>(
            eb.selectFrom("card")
              .select((eb) => ["card.lang", eb.fn.count("card.id").as("number_of_cards")])
              // .distinctOn("card.lang")
              .groupBy("card.lang")
              .whereRef("card.set_id", "=", "card_set.id")
              .innerJoin("language", "language.id", "card.lang")
              .orderBy("language.sequence")
              .$castTo<MtgCardSetLanguageDto>()
          ).as("languages"),
          eb.selectFrom("card as c2")
            .select((eb) => eb.fn.count(sql`DISTINCT c2.oracle_id`).as("unique_cards"))
            .whereRef("c2.set_id", "=", "card_set.id")
            .as("unique_cards")
        ])
        .where("card_set.id", "=", cardSetId)
        // .$call(this.logCompilable)
        .$castTo<MtgCardSetDetailsDto>()
        .executeTakeFirst()
        .then((r) => this.resultFactory.createSuccessResult<MtgCardSetDetailsDto>(r)
        );
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<MtgCardSetDetailsDto>(err);
    }
  }
  //#endregion
}
