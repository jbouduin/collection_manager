import * as helpers from "kysely/helpers/sqlite";
import { inject, injectable } from "tsyringe";
import { Selectable } from "kysely";
import { DtoCardSymbol, DtoCardSymbolAlternative, DtoCardSymbolColorMap } from "../../../../common/dto";
import { cardSymbolAlternativeTableFields, cardSymbolColorMapTableFields, cardSymbolTableFields } from "../../../../main/database/schema/card-symbol/table-field.constants";
import { CardSymbolTable } from "../../../database/schema";
import { IDatabaseService, IImageCacheService, ILogService } from "../../infra/interfaces";
import { ICardSymbolRepository } from "../interfaces";
import { BaseRepository } from "./base.repository";
import { INFRASTRUCTURE } from "../../service.tokens";


@injectable()
export class CardSymbolRepository extends BaseRepository implements ICardSymbolRepository {
  //#region Private readonly fields -------------------------------------------
  private imageCacheService: IImageCacheService;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(
    @inject(INFRASTRUCTURE.DatabaseService) databaseService: IDatabaseService,
    @inject(INFRASTRUCTURE.ImageCacheService) imageCacheService: IImageCacheService,
    @inject(INFRASTRUCTURE.LogService) logService: ILogService
  ) {
    super(databaseService, logService);
    this.imageCacheService = imageCacheService;
  }
  //#endregion

  //#region ICardSymbolRepository methods -------------------------------------
  /* eslint-disable @stylistic/function-paren-newline */
  public async getAll(): Promise<Array<DtoCardSymbol>> {
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
      .execute();
  }

  public getCardSymbolSvg(): Promise<Map<string, string>> {
    return this.database
      .selectFrom("card_symbol")
      .selectAll()
      .execute()
      .then((cardSymbols: Array<Selectable<CardSymbolTable>>) => {
        const result = new Map<string, string>();
        cardSymbols.forEach((cardSymbol: Selectable<CardSymbolTable>) => result.set(cardSymbol.id, this.imageCacheService.getCardSymbolSvg(cardSymbol)));
        return result;
      });
  }
}
