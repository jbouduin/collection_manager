import { ExpressionOrFactory, InsertResult, SqlBool, Transaction, UpdateResult } from "kysely";

import { inject, injectable } from "tsyringe";

import { SymbologySelectDto } from "../../../../common/dto";
import { ProgressCallback } from "../../../../common/ipc-params";
import { DatabaseSchema, Symbology, SymbologyAlternative, SymbologyColorMap } from "../../../database/schema";
import ADAPTTOKENS, { ISymbologyAdapter, ISymbologyAlternativeAdapter, ISymbologyColorMapAdapter } from "../../scryfall/adapt/interface";
import INFRATOKENS, { IDatabaseService, IImageCacheService } from "../../infra/interfaces";
import { ISymbologyRepository } from "../interfaces";
import { BaseRepository } from "./base.repository";


@injectable()
export class SymbologyRepository extends BaseRepository implements ISymbologyRepository {

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

  //#region ISymbologyRepository methods --------------------------------------
  public async getAll(): Promise<Array<SymbologySelectDto>> {
    return Promise.all([
      this.database.selectFrom("symbology").selectAll().execute(),
      this.database.selectFrom("symbology_color_map").selectAll().execute(),
      this.database.selectFrom("symbology_alternative").selectAll().execute()
    ])
      .then((result: [Array<Symbology>, Array<SymbologyColorMap>, Array<SymbologyAlternative>]) => {

        return result[0].map((symbol: Symbology) => {
          const dto: SymbologySelectDto = {
            symbology: symbol,
            alternatives: result[2].filter((alternative: SymbologyAlternative) => alternative.symbology_id == symbol.id),
            colors: result[1].filter((color: SymbologyColorMap) => color.symbology_id == symbol.id)
          };
          return dto;
        });
      });

  }

  public getAllWithCachedSvg(): Promise<Map<string, string>> {
    return this.database
      .selectFrom("symbology")
      .selectAll()
      .execute()
      .then(((cardSymbols: Array<Symbology>) => {
      const result = new Map<string, string>();
      cardSymbols.forEach((cardSymbol: Symbology) =>
        result.set(cardSymbol.id, this.imageCacheService.getCardSymbolSvg(cardSymbol))
      );
      return result;
    }));
  }


}
