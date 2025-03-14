import { inject, singleton } from "tsyringe";
import { BaseRouter, IResult, IRouter, RouteCallback, RoutedRequest } from "../../base";
import { INFRASTRUCTURE } from "../../service.tokens";
import { ILogService, IResultFactory, IRouterService, IWindowsService } from "../interfaces";

@singleton()
export class WindowRouter extends BaseRouter implements IRouter {
  //#region private fields ----------------------------------------------------
  private readonly windowsService: IWindowsService;
  //#endregion

  //#region Constructor -------------------------------------------------------
  public constructor(
    @inject(INFRASTRUCTURE.LogService) logService: ILogService,
    @inject(INFRASTRUCTURE.ResultFacotry) resultFactory: IResultFactory,
    @inject(INFRASTRUCTURE.WindowsService) windowsService: IWindowsService
  ) {
    super(logService, resultFactory);
    this.windowsService = windowsService;
  }
  //#endregion

  //#region IRouteDestinationService methods ----------------------------------
  public setRoutes(router: IRouterService): void {
    router.registerGetRoute("/window/deck/:id", this.openDeckWindow.bind(this) as RouteCallback);
  }
  //#endregion

  //#region Callbacks ---------------------------------------------------------
  private openDeckWindow(request: RoutedRequest<void>): Promise<IResult<void>> {
    return this.parseIntegerUrlParameter(request.params["id"], "Deck ID").continueAsync<void>(
      (idResult: IResult<number>) => {
        this.windowsService.getDeckWindow(idResult.data);
        return this.resultFactory.createNoContentResultPromise();
      },
      (idResult: IResult<number>) => idResult.convertAsync<void>()
    );
  }
  //#endregion
}
