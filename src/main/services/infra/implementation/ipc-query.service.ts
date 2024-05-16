import { container, singleton } from "tsyringe";

import { IQueryOrSyncParam, QueryOrSyncOptions } from "../../../../common/ipc-params";
import { CardQueryOptions } from "../../../../common/ipc-params/card-query.options";
import REPOTOKENS, { ICardRepository, ICardSetRepository, ICatalogRepository, IColorRepository, ILanguageRepository, ISymbologyRepository } from "../../repo/interfaces";
import { IIpcQueryService } from "../interfaces";


@singleton()
export class IpcQueryService implements IIpcQueryService {

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  public async handle(params: IQueryOrSyncParam<QueryOrSyncOptions>): Promise<any> {
    console.log("start IpcQueryService.handling", params);
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
        // TODO we should not do this
        break;
    }
  }
}
