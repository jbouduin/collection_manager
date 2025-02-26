import { Selectable } from "kysely";
import * as helpers from "kysely/helpers/sqlite";
import { inject, injectable } from "tsyringe";
import { MtgCardSymbolDto, MtgCardSymbolAlternative, MtgCardSymbolColorMapDto } from "../../../../common/dto";
import { IResult } from "../../../services/base";
import { IDatabaseService, ILogService, IResultFactory } from "../../../services/infra/interfaces";
import { INFRASTRUCTURE } from "../../../services/service.tokens";
import { CardSymbolTable } from "../../schema";
import { CARD_SYMBOL_ALTERNATIVE_TABLE_FIELDS, CARD_SYMBOL_COLOR_MAP_TABLE_FIELDS, CARD_SYMBOL_TABLE_FIELDS } from "../../schema/card-symbol/table-field.constants";
import { ICardSymbolRepository } from "../interfaces";
import { BaseRepository } from "./base.repository";


@injectable()
export class CardSymbolRepository extends BaseRepository implements ICardSymbolRepository {
  //#region Constructor & C° --------------------------------------------------
  public constructor(
    @inject(INFRASTRUCTURE.DatabaseService) databaseService: IDatabaseService,
    @inject(INFRASTRUCTURE.LogService) logService: ILogService,
    @inject(INFRASTRUCTURE.ResultFacotry) resultFactory: IResultFactory
  ) {
    super(databaseService, logService, resultFactory);
  }
  //#endregion

  //#region ICardSymbolRepository methods -------------------------------------
  /* eslint-disable @stylistic/function-paren-newline */
  public async getAll(): Promise<IResult<Array<MtgCardSymbolDto>>> {
    try {
      return await this.database
        .selectFrom("card_symbol")
        .select((eb) => [
          ...CARD_SYMBOL_TABLE_FIELDS,
          helpers.jsonArrayFrom<MtgCardSymbolColorMapDto>(
            eb.selectFrom("card_symbol_color_map")
              .select(CARD_SYMBOL_COLOR_MAP_TABLE_FIELDS)
              .whereRef("card_symbol_color_map.card_symbol_id", "=", "card_symbol.id")
              .$castTo<MtgCardSymbolColorMapDto>()
          ).as("colors"),
          helpers.jsonObjectFrom<MtgCardSymbolAlternative>(
            eb.selectFrom("card_symbol_alternative")
              .select(CARD_SYMBOL_ALTERNATIVE_TABLE_FIELDS)
              .whereRef("card_symbol_alternative.card_symbol_id", "=", "card_symbol.id")
              .$castTo<MtgCardSymbolAlternative>()
          ).as("alternatives")
        ])
        .$castTo<MtgCardSymbolDto>()
        .execute()
        .then((r: Array<MtgCardSymbolDto>) => this.resultFactory.createSuccessResult<Array<MtgCardSymbolDto>>(r));
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<Array<MtgCardSymbolDto>>(err);
    }
  }

  public getCardSymbols(): Promise<IResult<Array<Selectable<CardSymbolTable>>>> {
    try {
      return this.database
        .selectFrom("card_symbol")
        .selectAll()
        .$castTo<Selectable<CardSymbolTable>>()
        .execute()
        .then((cardSymbols: Array<Selectable<CardSymbolTable>>) => this.resultFactory.createSuccessResult<Array<Selectable<CardSymbolTable>>>(cardSymbols));
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<Array<Selectable<CardSymbolTable>>>(err);
    }
  }
}
