import { inject, singleton } from "tsyringe";
import { BaseRouter, IResult, IRouter, RouteCallback, RoutedRequest } from "../../base";
import { INFRASTRUCTURE } from "../../service.tokens";
import { IImageCacheService, IResultFactory, IRouterService } from "../interfaces";
import { ILogService } from "../interfaces/log.service";


@singleton()
export class AssetRouter extends BaseRouter implements IRouter {
  //#region Private fields ----------------------------------------------------
  private readonly imageCacheService: IImageCacheService;
  //#endregion

  //#region Constructor -------------------------------------------------------
  public constructor(
    @inject(INFRASTRUCTURE.LogService) logService: ILogService,
    @inject(INFRASTRUCTURE.ResultFacotry) resultFactory: IResultFactory,
    @inject(INFRASTRUCTURE.ImageCacheService) imageCacheService: IImageCacheService
  ) {
    super(logService, resultFactory);
    this.imageCacheService = imageCacheService;
  }
  //#endregion

  //#region IRouteDestinationService methods ----------------------------------
  public setRoutes(router: IRouterService): void {
    router.registerGetRoute("/asset", this.asset.bind(this) as RouteCallback);
  }
  //#endregion

  //#region private methods ---------------------------------------------------
  public asset(request: RoutedRequest<void>): Promise<IResult<string>> {
    return this.imageCacheService.getAsset(request.queryParams["path"]);
  }
  //#endregion
}
