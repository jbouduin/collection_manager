import { container, singleton } from "tsyringe";

import { RulingsByCardIdSelectDto } from "../../../../common/dto";
import { IQueryParam, QueryOptions, RulingQueryOptions } from "../../../../common/ipc-params";
import { CardQueryOptions } from "../../../../common/ipc-params/card-query.options";
import REPOTOKENS, { ICardRepository, ICardSetRepository, ICatalogRepository, IColorRepository, ILanguageRepository, IRulingRepository, ISymbologyRepository } from "../../repo/interfaces";
import SYNCTOKENS, { IRulingSyncService } from "../../scryfall";
import { IIpcQueryService } from "../interfaces";


@singleton()
export class IpcQueryService implements IIpcQueryService {

  //#region IIpcQueryService methods ------------------------------------------
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  public async handle(params: IQueryParam<QueryOptions>): Promise<any> {
    // console.log("start IpcQueryService.handling", params);
    switch (params.type) {
      case "Card":
        return container.resolve<ICardRepository>(REPOTOKENS.CardRepository).getWithOptions(params.options as CardQueryOptions);
      case "CardSet":
        return container.resolve<ICardSetRepository>(REPOTOKENS.CardSetRepository).getAll();
      case "Catalog":
        return container.resolve<ICatalogRepository>(REPOTOKENS.CatalogRepository).getAll("AbilityWords");
      case "Color":
        return container.resolve<IColorRepository>(REPOTOKENS.ColorRepository).getAll();
      case "Language":
        return container.resolve<ILanguageRepository>(REPOTOKENS.LanguageRepository).getAll();
      case "Symbology":
        return container.resolve<ISymbologyRepository>(REPOTOKENS.SymbologyRepository).getAll();
      case "SymbologyCachedSvg":
        return container.resolve<ISymbologyRepository>(REPOTOKENS.SymbologyRepository).getAllWithCachedSvg();
      case "Ruling":
        return this.handleRuling(params.options as RulingQueryOptions);
    }
  }
  //#endregion

  //#region Private methods ---------------------------------------------------
  private async handleRuling(options: RulingQueryOptions): Promise<RulingsByCardIdSelectDto> {
    const rulingRepository = container.resolve<IRulingRepository>(REPOTOKENS.RulingRepository);
    // NOW if there are no rulings, but we already synced, we do not have to resync
    return rulingRepository.getByCardId(options.cardId)
      .then((queryResult: RulingsByCardIdSelectDto) => {
        if (queryResult.length == 0) {
          return container.resolve<IRulingSyncService>(SYNCTOKENS.RulingSyncService).sync({ cardId: options.cardId })
            .then(() => rulingRepository.getByCardId(options.cardId));
        } else {
          return queryResult;
        }
      });
  }
  //#endregion
}
