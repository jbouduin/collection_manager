import { container, inject, singleton } from "tsyringe";
import { CollectionDto, OwnedCardListDto, OwnedCardQuantityDto } from "../../../../common/dto";
import { ICollectionRepository } from "../../../database/repo/interfaces/collection.repository";
import { BaseRouter, IResult, IRouter, RouteCallback, RoutedRequest } from "../../base";
import { ILogService, IResultFactory, IRouterService } from "../../infra/interfaces";
import { INFRASTRUCTURE, REPOSITORIES } from "../../service.tokens";


@singleton()
export class CollectionRouter extends BaseRouter implements IRouter {
  //#region Constructor & C° --------------------------------------------------
  public constructor(
    // @inject(REPOSITORIES.CollectionRepository) collectionRepository: ICollectionRepository,
    @inject(INFRASTRUCTURE.LogService) logService: ILogService,
    @inject(INFRASTRUCTURE.ResultFacotry) resultFactory: IResultFactory
  ) {
    super(logService, resultFactory);
  }
  //#endregion

  //#region IRouteDestinationService methods ----------------------------------
  public setRoutes(router: IRouterService): void {
    router.registerDeleteRoute("/collection/:id", this.deleteCollection.bind(this) as RouteCallback);
    router.registerGetRoute("/collection", this.getAll.bind(this) as RouteCallback);
    router.registerGetRoute("/collection/:id/card", this.getCardsOfCollection.bind(this) as RouteCallback);
    router.registerGetRoute("/collection/:collectionid/card/:cardid", this.getOwnershipOfCardInCollection.bind(this) as RouteCallback);
    router.registerPostRoute("/collection", this.createCollection.bind(this) as RouteCallback);
    router.registerPostRoute("/collection/:collectionid/card/:cardid", this.updateQuantities.bind(this) as RouteCallback);
    router.registerPutRoute("/collection/:id", this.updateCollection.bind(this) as RouteCallback);
  }
  //#endregion

  //#region Route callbacks ---------------------------------------------------
  private createCollection(request: RoutedRequest<CollectionDto>): Promise<IResult<CollectionDto>> {
    return container.resolve<ICollectionRepository>(REPOSITORIES.CollectionRepository).createCollection(request.data);
  }

  private deleteCollection(request: RoutedRequest<void>): Promise<IResult<number>> {
    return this.parseIntegerUrlParameter(request.params["id"], "Collection ID")
      .continueAsync<number>(
        (r: IResult<number>) => container.resolve<ICollectionRepository>(REPOSITORIES.CollectionRepository).deleteCollection(r.data),
        (r: IResult<number>) => Promise.resolve(r)
      );
  }

  private getAll(_request: RoutedRequest<void>): Promise<IResult<Array<CollectionDto>>> {
    return container.resolve<ICollectionRepository>(REPOSITORIES.CollectionRepository).getAllCollections();
  }

  private getCardsOfCollection(request: RoutedRequest<void>): Promise<IResult<Array<OwnedCardListDto>>> {
    return this.parseIntegerUrlParameter(request.params["id"], "Collection ID")
      .continueAsync<Array<OwnedCardListDto>>(
        (r: IResult<number>) => container.resolve<ICollectionRepository>(REPOSITORIES.CollectionRepository).getCollectionCardList(r.data),
        (r: IResult<number>) => r.castAsync<Array<OwnedCardListDto>>(new Array<OwnedCardListDto>())
      );
  }

  private getOwnershipOfCardInCollection(request: RoutedRequest<void>): Promise<IResult<Array<OwnedCardQuantityDto>>> {
    return this.parseIntegerUrlParameter(request.params["collectionid"], "Collection ID")
      .continueAsync<Array<OwnedCardQuantityDto>>(
        (r: IResult<number>) => container.resolve<ICollectionRepository>(REPOSITORIES.CollectionRepository).getCardQuantitiesForCardInCollection(request.params["cardid"], r.data),
        (r: IResult<number>) => r.castAsync<Array<OwnedCardQuantityDto>>(null)
      );
  }

  private updateCollection(request: RoutedRequest<CollectionDto>): Promise<IResult<CollectionDto>> {
    return this.parseIntegerUrlParameter(request.params["id"], "Collection ID")
      .continueAsync<CollectionDto>(
        (r: IResult<number>) => {
          if (r.data != request.data.id) {
            return this.resultFactory.createBadRequestResultPromise<CollectionDto>();
          } else {
            return container.resolve<ICollectionRepository>(REPOSITORIES.CollectionRepository).updateCollection(request.data);
          }
        },
        (r: IResult<number>) => r.castAsync<CollectionDto>(null)
      );
  }

  private updateQuantities(request: RoutedRequest<Array<OwnedCardQuantityDto>>): Promise<IResult<Array<OwnedCardQuantityDto>>> {
    return this.parseIntegerUrlParameter(request.params["collectionid"], "Collection ID")
      .continueAsync<Array<OwnedCardQuantityDto>>(
        (r: IResult<number>) => container
          .resolve<ICollectionRepository>(REPOSITORIES.CollectionRepository)
          .saveQuantitiesForCardInCollection(request.params["cardid"], r.data, request.data),
        (r: IResult<number>) => r.castAsync<Array<OwnedCardQuantityDto>>(request.data)
      );
  }
  //#endregion
}
