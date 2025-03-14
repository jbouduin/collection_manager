import { container, inject, singleton } from "tsyringe";
import { IScryfallBulkDataItemDto, ISyncParamDto } from "../../../../common/dto";
import { BaseRouter, IResult, IRouter, RouteCallback, RoutedRequest } from "../../base";
import { ILogService, IResultFactory, IRouterService } from "../../infra/interfaces";
import { INFRASTRUCTURE, MTG, SCRYFALL } from "../../service.tokens";
import { IMtgSyncService } from "../interfaces";
import { IScryfallClient } from "../../scryfall/client/interfaces";


@singleton()
export class MtgSyncRouter extends BaseRouter implements IRouter {
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
    router.registerGetRoute("/mtg-sync/bulk", this.getBulkItems.bind(this) as RouteCallback);
    router.registerPostRoute("/mtg-sync", this.sync.bind(this) as RouteCallback);
  }
  //#endregion

  //#region Route callbacks ---------------------------------------------------
  private getBulkItems(_request: RoutedRequest<void>): Promise<IResult<Array<IScryfallBulkDataItemDto>>> {
    return container.resolve<IScryfallClient>(SCRYFALL.ScryfallClient)
      .getBulkDefinitions()
      .then(
        (r: Array<IScryfallBulkDataItemDto>) => this.resultFactory.createSuccessResult<Array<IScryfallBulkDataItemDto>>(r),
        (reason: unknown) => this.resultFactory.createExceptionResult(reason)
      );
  }

  private sync(request: RoutedRequest<ISyncParamDto>): Promise<IResult<void>> {
    return container.resolve<IMtgSyncService>(MTG.SyncService)
      .synchronize(request.data, request.sender)
      .then(
        () => this.resultFactory.createSuccessResult<void>(null),
        (reason: unknown) => this.resultFactory.createExceptionResult(reason)
      );
  }
  //#endregion
}
