
import { inject, injectable } from "tsyringe";

import { CardSymbolDto } from "../../../../common/dto";
import { CardSymbolAlternativeTable, CardSymbolColorMapTable, CardSymbolTable } from "../../../database/schema";
import INFRATOKENS, { IDatabaseService, IImageCacheService } from "../../infra/interfaces";
import { ICardSymbolRepository } from "../interfaces";
import { BaseRepository } from "./base.repository";
import { Selectable } from "kysely";


@injectable()
export class CardSymbolRepository extends BaseRepository implements ICardSymbolRepository {

  //#region Private readonly fields -------------------------------------------
  private imageCacheService: IImageCacheService;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(
    @inject(INFRATOKENS.DatabaseService) databaseService: IDatabaseService,
    @inject(INFRATOKENS.ImageCacheService) imageCacheService: IImageCacheService) {
    super(databaseService);
    this.imageCacheService = imageCacheService;
  }
  //#endregion

  //#region ICardSymbolRepository methods -------------------------------------
  public async getAll(): Promise<Array<CardSymbolDto>> {
    return Promise.all([
      this.database.selectFrom("card_symbol").selectAll().execute(),
      this.database.selectFrom("card_symbol_color_map").selectAll().execute(),
      this.database.selectFrom("card_symbol_alternative").selectAll().execute()
    ])
      .then((result: [
        Array<Selectable<CardSymbolTable>>,
        Array<Selectable<CardSymbolColorMapTable>>,
        Array<Selectable<CardSymbolAlternativeTable>>]) => {

        return result[0].map((symbol: Selectable<CardSymbolTable>) => {
          const dto: CardSymbolDto = {
            cardSymbol: symbol,
            alternatives: result[2].filter((alternative: Selectable<CardSymbolAlternativeTable>) => alternative.card_symbol_id == symbol.id),
            colors: result[1].filter((color: Selectable<CardSymbolColorMapTable>) => color.card_symbol_id == symbol.id)
          };
          return dto;
        });
      });

  }

  public getAllWithCachedSvg(): Promise<Map<string, string>> {
    return this.database
      .selectFrom("card_symbol")
      .selectAll()
      .execute()
      .then(((cardSymbols: Array<Selectable<CardSymbolTable>>) => {
      const result = new Map<string, string>();
        cardSymbols.forEach((cardSymbol: Selectable<CardSymbolTable>) =>
        result.set(cardSymbol.id, this.imageCacheService.getCardSymbolSvg(cardSymbol))
      );
      return result;
    }));
  }


}
