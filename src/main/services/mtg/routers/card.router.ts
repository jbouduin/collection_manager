import { container, inject, singleton } from "tsyringe";
import { ICardQueryDto, ICatalogItemDto, IMtgCardDetailDto, IMtgCardListDto, IOwnedCardQuantityDto, QUERY_PARAM_LIST_SEPARATOR, CardQueryParamToken } from "../../../../common/dto";
import { ICardRepository } from "../../../database/repo/interfaces";
import { ICollectionRepository } from "../../../database/repo/interfaces/collection.repository";
import { BaseRouter, IResult, IRouter, RouteCallback, RoutedRequest } from "../../base";
import { ILogService, IResultFactory, IRouterService } from "../../infra/interfaces";
import { INFRASTRUCTURE, REPOSITORIES } from "../../service.tokens";
import { CardRarity, CatalogType, ECatalogType, MtgGameFormat, MtgColor } from "../../../../common/types";


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
  private getCard(request: RoutedRequest<void>): Promise<IResult<IMtgCardDetailDto>> {
    return container.resolve<ICardRepository>(REPOSITORIES.CardRepository).getCardDetails(request.params["id"])
      .then((r: IResult<IMtgCardDetailDto>) => {
        return r.data != undefined
          ? this.resultFactory.createSuccessResult<IMtgCardDetailDto>(r.data)
          : this.resultFactory.createNotFoundResult<IMtgCardDetailDto>(request.params["id"]);
      });
  }

  private getCardOwnerShip(request: RoutedRequest<void>): Promise<IResult<Array<IOwnedCardQuantityDto>>> {
    return container.resolve<ICollectionRepository>(REPOSITORIES.CollectionRepository).getCardQuantitiesForCard(request.params["id"]);
  }

  private queryCards(request: RoutedRequest<void>): Promise<IResult<Array<IMtgCardListDto>>> {
    const queryParams: ICardQueryDto = {
      ownedCards: this.extractQueryParam(request.queryParams, "own") ? true : false,
      selectedCardColors: this.extractQueryParam(request.queryParams, "cc")?.split(QUERY_PARAM_LIST_SEPARATOR) as Array<MtgColor>,
      selectedCatalogItems: this.extractCatalogQueryParams(request.queryParams),
      selectedIdentityColors: this.extractQueryParam(request.queryParams, "ic")?.split(QUERY_PARAM_LIST_SEPARATOR) as Array<MtgColor>,
      selectedGameFormats: this.extractQueryParam(request.queryParams, "format")?.split(QUERY_PARAM_LIST_SEPARATOR) as Array<MtgGameFormat>,
      selectedProducedManaColors: this.extractQueryParam(request.queryParams, "pm")?.split(QUERY_PARAM_LIST_SEPARATOR) as Array<MtgColor>,
      selectedRarities: this.extractQueryParam(request.queryParams, "rarity")?.split(QUERY_PARAM_LIST_SEPARATOR) as Array<CardRarity>,
      selectedSets: this.extractQueryParam(request.queryParams, "set")?.split(QUERY_PARAM_LIST_SEPARATOR)
    };
    this.logService.debug("Main", JSON.stringify(queryParams, null, 2));
    return container.resolve<ICardRepository>(REPOSITORIES.CardRepository).queryCards(queryParams);
  }

  private updateQuantities(request: RoutedRequest<Array<IOwnedCardQuantityDto>>): Promise<IResult<Array<IOwnedCardQuantityDto>>> {
    return container.resolve<ICollectionRepository>(REPOSITORIES.CollectionRepository)
      .saveQuantitiesForCard(request.params["id"], request.data);
  }
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  private extractQueryParam(queryParams: Record<string, string>, token: CardQueryParamToken): string | null {
    return queryParams[token];
  }

  private extractCatalogQueryParams(queryParams: Record<string, string>): Array<ICatalogItemDto> {
    const result = new Array<ICatalogItemDto>();
    Object.keys(ECatalogType).forEach((catalog: CatalogType) => {
      this.extractQueryParam(queryParams, catalog)?.split(QUERY_PARAM_LIST_SEPARATOR)
        .forEach((item: string) => result.push({ catalog_name: catalog, item: item }));
    });
    return result;
  }
  //#endregion
}
