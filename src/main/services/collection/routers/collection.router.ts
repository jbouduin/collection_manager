import { inject, singleton } from "tsyringe";
import { CollectionDto } from "../../../../common/dto";
import { ICollectionRepository } from "../../../database/repo/interfaces/collection.repository";
import { BaseRouter, IResult, IRouter, RouteCallback, RoutedRequest } from "../../base";
import { ILogService, IResultFactory, IRouterService } from "../../infra/interfaces";
import { INFRASTRUCTURE, REPOSITORIES } from "../../service.tokens";


@singleton()
export class CollectionRouter extends BaseRouter implements IRouter {
  //#region Private fields ----------------------------------------------------
  private readonly collectionRepository: ICollectionRepository;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(
    @inject(REPOSITORIES.CollectionRepository) collectionRepository: ICollectionRepository,
    @inject(INFRASTRUCTURE.LogService) logService: ILogService,
    @inject(INFRASTRUCTURE.ResultFacotry) resultFactory: IResultFactory
  ) {
    super(logService, resultFactory);
    this.collectionRepository = collectionRepository;
  }
  //#endregion

  //#region IRouteDestinationService methods ----------------------------------
  public setRoutes(router: IRouterService): void {
    router.registerGetRoute("/collection", this.getAll.bind(this) as RouteCallback);
  }
  //#endregion

  //#region Route callbacks ---------------------------------------------------
  private getAll(_request: RoutedRequest<void>): Promise<IResult<Array<CollectionDto>>> {
    return this.collectionRepository.getAll();
  }
  //#endregion
}
