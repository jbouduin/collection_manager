import { Selectable } from "kysely";
import * as helpers from "kysely/helpers/sqlite";
import { inject, injectable } from "tsyringe";
import { DtoCardSymbol, DtoCardSymbolAlternative, DtoCardSymbolColorMap } from "../../../../common/dto";
import { IResult } from "../../../services/base";
import { IDatabaseService, IImageCacheService, ILogService, IResultFactory } from "../../../services/infra/interfaces";
import { INFRASTRUCTURE } from "../../../services/service.tokens";
import { CardSymbolTable } from "../../schema";
import { cardSymbolAlternativeTableFields, cardSymbolColorMapTableFields, cardSymbolTableFields } from "../../schema/card-symbol/table-field.constants";
import { ICardSymbolRepository } from "../interfaces";
import { BaseRepository } from "./base.repository";


@injectable()
export class CardSymbolRepository extends BaseRepository implements ICardSymbolRepository {
  //#region Private readonly fields -------------------------------------------
  private imageCacheService: IImageCacheService;
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

  //#region ICardSymbolRepository methods -------------------------------------
  /* eslint-disable @stylistic/function-paren-newline */
  public async getAll(): Promise<IResult<Array<DtoCardSymbol>>> {
    try {
      return await this.database
        .selectFrom("card_symbol")
        .select((eb) => [
          ...cardSymbolTableFields,
          helpers.jsonArrayFrom<DtoCardSymbolColorMap>(
            eb.selectFrom("card_symbol_color_map")
              .select(cardSymbolColorMapTableFields)
              .whereRef("card_symbol_color_map.card_symbol_id", "=", "card_symbol.id")
              .$castTo<DtoCardSymbolColorMap>()
          ).as("colors"),
          helpers.jsonObjectFrom<DtoCardSymbolAlternative>(
            eb.selectFrom("card_symbol_alternative")
              .select(cardSymbolAlternativeTableFields)
              .whereRef("card_symbol_alternative.card_symbol_id", "=", "card_symbol.id")
              .$castTo<DtoCardSymbolAlternative>()
          ).as("alternatives")
        ])
        .$castTo<DtoCardSymbol>()
        .execute()
        .then((r: Array<DtoCardSymbol>) => this.resultFactory.createSuccessResult<Array<DtoCardSymbol>>(r));
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<Array<DtoCardSymbol>>(err);
    }
  }

  // TODO move the logic of loadin the svg's out
  public getCardSymbolSvg(): Promise<IResult<Map<string, string>>> {
    try {
      return this.database
        .selectFrom("card_symbol")
        .selectAll()
        .execute()
        .then((cardSymbols: Array<Selectable<CardSymbolTable>>) => {
          const result = new Map<string, string>();
          cardSymbols.forEach((cardSymbol: Selectable<CardSymbolTable>) => result.set(cardSymbol.id, this.imageCacheService.getCardSymbolSvg(cardSymbol)));
          return this.resultFactory.createSuccessResult<Map<string, string>>(result);
        });
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<Map<string, string>>(err);
    }
  }
}
