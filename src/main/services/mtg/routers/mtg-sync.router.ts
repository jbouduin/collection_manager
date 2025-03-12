import { inject, singleton } from "tsyringe";
import { ISyncParamDto } from "../../../../common/dto";
import { BaseRouter, IResult, IRouter, RouteCallback, RoutedRequest } from "../../base";
import { ILogService, IResultFactory, IRouterService } from "../../infra/interfaces";
import { INFRASTRUCTURE, MTG } from "../../service.tokens";
import { MtgSyncService } from "../implementation/mtg-sync.service";


@singleton()
export class MtgSyncRouter extends BaseRouter implements IRouter {
  //#region Private fields ----------------------------------------------------
  private readonly mtgSyncService: MtgSyncService;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(
    @inject(MTG.SyncService) mtgSyncService: MtgSyncService,
    @inject(INFRASTRUCTURE.LogService) logService: ILogService,
    @inject(INFRASTRUCTURE.ResultFacotry) resultFactory: IResultFactory
  ) {
    super(logService, resultFactory);
    this.mtgSyncService = mtgSyncService;
  }
  //#endregion

  //#region IRouteDestinationService methods ----------------------------------
  public setRoutes(router: IRouterService): void {
    router.registerPostRoute("/mtg-sync", this.sync.bind(this) as RouteCallback);
  }
  //#endregion

  //#region Route callbacks ---------------------------------------------------
  private sync(request: RoutedRequest<ISyncParamDto>): Promise<IResult<void>> {
    try {
      return this.mtgSyncService
        .synchronize(request.data, request.sender)
        .then(() => this.resultFactory.createSuccessResultPromise<void>(undefined));
    } catch (err: unknown) {
      return this.resultFactory.createExceptionResultPromise(err);
    }
  }
  //#endregion
}
