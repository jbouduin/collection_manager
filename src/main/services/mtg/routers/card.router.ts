import { container, inject, singleton } from "tsyringe";
import { MtgCardDetailDto, MtgCardListDto, OwnedCardQuantityDto } from "../../../../common/dto";
import { ICardRepository } from "../../../database/repo/interfaces";
import { ICollectionRepository } from "../../../database/repo/interfaces/collection.repository";
import { BaseRouter, IResult, IRouter, RouteCallback, RoutedRequest } from "../../base";
import { ILogService, IResultFactory, IRouterService } from "../../infra/interfaces";
import { INFRASTRUCTURE, REPOSITORIES } from "../../service.tokens";


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
    return container.resolve<ICardRepository>(REPOSITORIES.CardRepository).queryCards(request.queryParams["sets"].split(","));
  }

  private updateQuantities(request: RoutedRequest<Array<OwnedCardQuantityDto>>): Promise<IResult<Array<OwnedCardQuantityDto>>> {
    return container.resolve<ICollectionRepository>(REPOSITORIES.CollectionRepository)
      .saveQuantitiesForCard(request.params["id"], request.data);
  }
  //#endregion
}
