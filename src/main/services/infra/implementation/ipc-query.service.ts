import { container, singleton } from "tsyringe";

import { DtoRulingLine, DtoSyncParam } from "../../../../common/dto";
import { AssetQueryOptions, CardSetDetailsQueryOptions, LegalityQueryOptions, QueryOptions, QueryParam, RulingQueryOptions } from "../../../../common/ipc-params";
import { CardQueryOptions } from "../../../../common/ipc-params/query/card-query.options";
import REPOTOKENS, { ICardRepository, ICardSetRepository, ICardSymbolRepository, ICatalogRepository, IColorRepository, ILanguageRepository, IOracleRepository } from "../../repo/interfaces";
import SYNCTOKENS, { IRulingSyncService } from "../../scryfall";
import INFRATOKENS, { IConfigurationService, IImageCacheService, IIpcQueryService } from "../interfaces";


@singleton()
export class IpcQueryService implements IIpcQueryService {

  //#region IIpcQueryService methods ------------------------------------------
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  public async handle(params: QueryParam<QueryOptions>): Promise<any> {
    // console.log("start IpcQueryService.handling", params);
    switch (params.type) {
      case "Asset":
        return container
          .resolve<IImageCacheService>(INFRATOKENS.ImageCacheService)
          .getAsset((params.options as AssetQueryOptions).path);
      case "Card":
        return container
          .resolve<ICardRepository>(REPOTOKENS.CardRepository)
          .getCards(params.options as CardQueryOptions);
      case "CardSet":
        return container
          .resolve<ICardSetRepository>(REPOTOKENS.CardSetRepository)
          .getAll();
      case "CardSetDetails":
        return container
          .resolve<ICardSetRepository>(REPOTOKENS.CardSetRepository)
          .getDetails((params.options as CardSetDetailsQueryOptions).cardSetId);
      case "Catalog":
        return container
          .resolve<ICatalogRepository>(REPOTOKENS.CatalogRepository)
          .getAll("AbilityWords");
      case "Color":
        return container
          .resolve<IColorRepository>(REPOTOKENS.ColorRepository)
          .getAll();
      case "Configuration":
        return container
          .resolve<IConfigurationService>(INFRATOKENS.ConfigurationService)
          .configuration;
      case "Language":
        return container
          .resolve<ILanguageRepository>(REPOTOKENS.LanguageRepository)
          .getAll();
      case "Legality":
        return container
          .resolve<IOracleRepository>(REPOTOKENS.OracleRepository)
          .getLegalities((params.options as LegalityQueryOptions).oracleId);
      case "CardSymbol":
        return container
          .resolve<ICardSymbolRepository>(REPOTOKENS.CardSymbolRepository)
          .getAll();
      case "CardSymbolCachedSvg":
        return container
          .resolve<ICardSymbolRepository>(REPOTOKENS.CardSymbolRepository)
          .getCardSymbolSvg();
      case "Ruling":
        return this.handleRuling(params.options as RulingQueryOptions);
    }
  }
  //#endregion

  //#region Private methods ---------------------------------------------------
  private async handleRuling(options: RulingQueryOptions): Promise<Array<DtoRulingLine>> {
    const oracleRepository = container.resolve<IOracleRepository>(REPOTOKENS.OracleRepository);
    return oracleRepository.getByCardId(options.cardId)
      .then((queryResult: Array<DtoRulingLine>) => {
        if (queryResult.length == 0) {
          const dtoSyncParam: DtoSyncParam = {
            catalogTypesToSync: [],
            syncCardSymbols: false,
            syncCardSets: false,
            rulingSyncType: "selectionOfCards",
            cardSyncType: "none",
            cardSelectionToSync: [options.cardId],
            cardImageStatusToSync: [],
            syncCardsSyncedBeforeNumber: 0,
            syncCardsSyncedBeforeUnit: undefined,
            cardSetCodeToSyncCardsFor: undefined,
            changedImageStatusAction: undefined
          };
          return container.resolve<IRulingSyncService>(SYNCTOKENS.RulingSyncService)
            .sync(dtoSyncParam, (s: string) => console.log(s))
            .then(() => oracleRepository
              .getByCardId(options.cardId)
              .then((afterSync: Array<DtoRulingLine>) => afterSync.filter((line: DtoRulingLine) => line.oracle_id !== null))
            );
        } else {
          return queryResult.filter((line: DtoRulingLine) => line.oracle_id !== null);
        }
      });
  }
  //#endregion
}
