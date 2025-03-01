import { container, inject, singleton } from "tsyringe";
import { CatalogItemDto, CatalogTypeDto } from "../../../../common/dto";
import { CatalogType } from "../../../../common/types";
import { ICatalogRepository } from "../../../database/repo/interfaces";
import { BaseRouter, IResult, IRouter, RouteCallback, RoutedRequest } from "../../base";
import { ILogService, IResultFactory, IRouterService } from "../../infra/interfaces";
import { INFRASTRUCTURE, REPOSITORIES } from "../../service.tokens";


@singleton()
export class CatalogRouter extends BaseRouter implements IRouter {
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
    router.registerGetRoute("/catalog", this.getCatalogs.bind(this) as RouteCallback);
    router.registerGetRoute("/catalog/:id", this.getCatalogItems.bind(this) as RouteCallback);
  }
  //#endregion

  //#region Route callbacks ---------------------------------------------------
  private getCatalogItems(request: RoutedRequest<void>): Promise<IResult<Array<CatalogItemDto>>> {
    return container
      .resolve<ICatalogRepository>(REPOSITORIES.CatalogRepository)
      .getCatalogItems(request.params["id"] as CatalogType, request.queryParams["item"]);
  }

  private getCatalogs(_request: RoutedRequest<void>): Promise<IResult<Array<CatalogTypeDto>>> {
    return container
      .resolve<ICatalogRepository>(REPOSITORIES.CatalogRepository)
      .getCatalogs();
  }
  //#endregion
}
