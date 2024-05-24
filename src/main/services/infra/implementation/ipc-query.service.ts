import { container, singleton } from "tsyringe";

import { RulingLineDto } from "../../../../common/dto";
import { QueryParam, QueryOptions, RulingQueryOptions } from "../../../../common/ipc-params";
import { CardQueryOptions } from "../../../../common/ipc-params/query/card-query.options";
import REPOTOKENS, { ICardRepository, ICardSetRepository, ICatalogRepository, IColorRepository, ILanguageRepository, IRulingRepository, ICardSymbolRepository } from "../../repo/interfaces";
import SYNCTOKENS, { IRulingSyncService } from "../../scryfall";
import { IIpcQueryService } from "../interfaces";


@singleton()
export class IpcQueryService implements IIpcQueryService {

  //#region IIpcQueryService methods ------------------------------------------
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  public async handle(params: QueryParam<QueryOptions>): Promise<any> {
    // console.log("start IpcQueryService.handling", params);
    switch (params.type) {
      case "Card":
        return container.resolve<ICardRepository>(REPOTOKENS.CardRepository).getCards(params.options as CardQueryOptions);
      case "CardSet":
        return container.resolve<ICardSetRepository>(REPOTOKENS.CardSetRepository).getAll();
      case "Catalog":
        return container.resolve<ICatalogRepository>(REPOTOKENS.CatalogRepository).getAll("AbilityWords");
      case "Color":
        return container.resolve<IColorRepository>(REPOTOKENS.ColorRepository).getAll();
      case "Language":
        return container.resolve<ILanguageRepository>(REPOTOKENS.LanguageRepository).getAll();
      case "CardSymbol":
        return container.resolve<ICardSymbolRepository>(REPOTOKENS.CardSymbolRepository).getAll();
      case "CardSymbolCachedSvg":
        return container.resolve<ICardSymbolRepository>(REPOTOKENS.CardSymbolRepository).getCardSymbolSvg();
      case "Ruling":
        return this.handleRuling(params.options as RulingQueryOptions);
    }
  }
  //#endregion

  //#region Private methods ---------------------------------------------------
  private async handleRuling(options: RulingQueryOptions): Promise<Array<RulingLineDto>> {
    const rulingRepository = container.resolve<IRulingRepository>(REPOTOKENS.RulingRepository);
    return rulingRepository.getByCardId(options.cardId)
      .then((queryResult: Array<RulingLineDto>) => {
        if (queryResult.length == 0) {
          return container.resolve<IRulingSyncService>(SYNCTOKENS.RulingSyncService).sync({source: "user", cardId: options.cardId}, null)
            .then(() => rulingRepository
              .getByCardId(options.cardId)
              .then((afterSync: Array<RulingLineDto>) => afterSync.filter((line: RulingLineDto) => line.oracle_id !== null))
            );
        } else {
          return queryResult.filter((line: RulingLineDto) => line.oracle_id !== null);
        }
      });
  }
  //#endregion
}
