import { container, inject, singleton } from "tsyringe";
import { CardQueryDto, CatalogItemDto, MtgCardDetailDto, MtgCardListDto, OwnedCardQuantityDto, QUERY_PARAM_LIST_SEPARATOR, QueryParamToken } from "../../../../common/dto";
import { ICardRepository } from "../../../database/repo/interfaces";
import { ICollectionRepository } from "../../../database/repo/interfaces/collection.repository";
import { BaseRouter, IResult, IRouter, RouteCallback, RoutedRequest } from "../../base";
import { ILogService, IResultFactory, IRouterService } from "../../infra/interfaces";
import { INFRASTRUCTURE, REPOSITORIES } from "../../service.tokens";
import { CardRarity, CatalogType, ECatalogType, GameFormat } from "../../../../common/types";


@singleton()
export class CardRouter extends BaseRouter implements IRouter {
  //#region Constructor & C° --------------------------------------------------
  public constructor(
    @inject(INFRASTRUCTURE.LogService) logService: ILogService,
    @inject(INFRASTRUCTURE.ResultFacotry) resultFactory: IResultFactory
  ) {
    super(logService, resultFactory);
  }
  //#endregion

  //#region IRouteDestinationService methods ----------------------------------
  public setRoutes(router: IRouterService): void {
    // router.registerGetRoute("/card/:id/ruling", this.getRuling.bind(this) as RouteCallback);
    router.registerGetRoute("/card/:id/collection", this.getCardOwnerShip.bind(this) as RouteCallback);
    router.registerGetRoute("/card/query", this.queryCards.bind(this) as RouteCallback);
    router.registerGetRoute("/card/:id", this.getCard.bind(this) as RouteCallback);
    router.registerPostRoute("/card/:id/collection", this.updateQuantities.bind(this) as RouteCallback);
  }
  //#endregion

  //#region Route callbacks ---------------------------------------------------
  private getCard(request: RoutedRequest<void>): Promise<IResult<MtgCardDetailDto>> {
    return container.resolve<ICardRepository>(REPOSITORIES.CardRepository).getCardDetails(request.params["id"])
      .then((r: IResult<MtgCardDetailDto>) => {
        return r.data != undefined
          ? this.resultFactory.createSuccessResult<MtgCardDetailDto>(r.data)
          : this.resultFactory.createNotFoundResult<MtgCardDetailDto>(request.params["id"]);
      });
  }

  private getCardOwnerShip(request: RoutedRequest<void>): Promise<IResult<Array<OwnedCardQuantityDto>>> {
    return container.resolve<ICollectionRepository>(REPOSITORIES.CollectionRepository).getCardQuantitiesForCard(request.params["id"]);
  }

  private queryCards(request: RoutedRequest<void>): Promise<IResult<Array<MtgCardListDto>>> {
    const queryParams: CardQueryDto = {
      ownedCards: this.extractQueryParam(request.queryParams, "own") ? true : false,
      selectedCatalogItems: this.extractCatalogQueryParams(request.queryParams),
      selectedGameFormats: this.extractQueryParam(request.queryParams, "gameformats")?.split(QUERY_PARAM_LIST_SEPARATOR) as Array<GameFormat>,
      selectedRarities: this.extractQueryParam(request.queryParams, "rarities")?.split(QUERY_PARAM_LIST_SEPARATOR) as Array<CardRarity>,
      selectedSets: this.extractQueryParam(request.queryParams, "sets")?.split(QUERY_PARAM_LIST_SEPARATOR)
    };
    return container.resolve<ICardRepository>(REPOSITORIES.CardRepository).queryCards(queryParams);
  }

  private updateQuantities(request: RoutedRequest<Array<OwnedCardQuantityDto>>): Promise<IResult<Array<OwnedCardQuantityDto>>> {
    return container.resolve<ICollectionRepository>(REPOSITORIES.CollectionRepository)
      .saveQuantitiesForCard(request.params["id"], request.data);
  }
  //#endregion

  private extractQueryParam(queryParams: Record<string, string>, token: QueryParamToken): string | null {
    return queryParams[token];
  }

  private extractCatalogQueryParams(queryParams: Record<string, string>): Array<CatalogItemDto> {
    const result = new Array<CatalogItemDto>();
    Object.keys(ECatalogType).forEach((catalog: CatalogType) => {
      this.extractQueryParam(queryParams, catalog)?.split(QUERY_PARAM_LIST_SEPARATOR)
        .forEach((item: string) => result.push({ catalog_name: catalog, item: item }));
    });
    return result;
  }
}
