import { container, singleton } from "tsyringe";

import { DtoRulingLine, SyncParamDto } from "../../../../common/dto";
import { AssetQueryOptions, CardSetDetailsQueryOptions, LegalityQueryOptions, QueryOptions, QueryParam, RulingQueryOptions } from "../../../../common/ipc-params";
import { CardQueryOptions } from "../../../../common/ipc-params/query/card-query.options";
import { ICardRepository, ICardSetRepository, ICardSymbolRepository, ICatalogRepository, IColorRepository, ILanguageRepository, IOracleRepository } from "../../repo/interfaces";
import { IRulingSyncService } from "../../scryfall";
import { IConfigurationService, IImageCacheService, IIpcQueryService } from "../interfaces";
import { ICollectionRepository } from "../../repo/interfaces/collection.repository";
import { INFRASTRUCTURE, REPOSITORIES, SCRYFALL } from "../../service.tokens";


@singleton()
export class IpcQueryService implements IIpcQueryService {

  //#region IIpcQueryService methods ------------------------------------------
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  public async handle(params: QueryParam<QueryOptions>): Promise<any> {
    // console.log("start IpcQueryService.handling", params);
    switch (params.type) {
      case "Asset":
        return container
          .resolve<IImageCacheService>(INFRASTRUCTURE.ImageCacheService)
          .getAsset((params.options as AssetQueryOptions).path);
      case "Card":
        return container
          .resolve<ICardRepository>(REPOSITORIES.CardRepository)
          .getCards(params.options as CardQueryOptions);
      case "CardSet":
        return container
          .resolve<ICardSetRepository>(REPOSITORIES.CardSetRepository)
          .getAll();
      case "CardSetDetails":
        return container
          .resolve<ICardSetRepository>(REPOSITORIES.CardSetRepository)
          .getDetails((params.options as CardSetDetailsQueryOptions).cardSetId);
      case "Catalog":
        return container
          .resolve<ICatalogRepository>(REPOSITORIES.CatalogRepository)
          .getAll("AbilityWords");
      case "Collection":
        return container
          .resolve<ICollectionRepository>(REPOSITORIES.CollectionRepository)
          .getAll();
      case "Color":
        return container
          .resolve<IColorRepository>(REPOSITORIES.ColorRepository)
          .getAll();
      case "Configuration":
        return container
          .resolve<IConfigurationService>(INFRASTRUCTURE.ConfigurationService)
          .configuration;
      case "Language":
        return container
          .resolve<ILanguageRepository>(REPOSITORIES.LanguageRepository)
          .getAll();
      case "Legality":
        return container
          .resolve<IOracleRepository>(REPOSITORIES.OracleRepository)
          .getLegalities((params.options as LegalityQueryOptions).oracleId);
      case "CardSymbol":
        return container
          .resolve<ICardSymbolRepository>(REPOSITORIES.CardSymbolRepository)
          .getAll();
      case "CardSymbolCachedSvg":
        return container
          .resolve<ICardSymbolRepository>(REPOSITORIES.CardSymbolRepository)
          .getCardSymbolSvg();
      case "Ruling":
        return this.handleRuling(params.options as RulingQueryOptions);
    }
  }
  //#endregion

  //#region Private methods ---------------------------------------------------
  private async handleRuling(options: RulingQueryOptions): Promise<Array<DtoRulingLine>> {
    const oracleRepository = container.resolve<IOracleRepository>(REPOSITORIES.OracleRepository);
    return oracleRepository.getByCardId(options.cardId)
      .then((queryResult: Array<DtoRulingLine>) => {
        if (queryResult.length == 0) {
          const dtoSyncParam: SyncParamDto = {
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
          return container.resolve<IRulingSyncService>(SCRYFALL.RulingSyncService)
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
