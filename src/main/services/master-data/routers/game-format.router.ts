import { container, inject, singleton } from "tsyringe";
import { GameFormatDto } from "../../../../common/dto";
import { IGameFormatRepository } from "../../../database/repo/interfaces";
import { BaseRouter, IResult, IRouter, RouteCallback, RoutedRequest } from "../../base";
import { ILogService, IResultFactory, IRouterService } from "../../infra/interfaces";
import { INFRASTRUCTURE, REPOSITORIES } from "../../service.tokens";


@singleton()
export class GameFormatRouter extends BaseRouter implements IRouter {
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
    router.registerGetRoute("/game-format", this.getAll.bind(this) as RouteCallback);
  }
  //#endregion

  //#region Route callbacks ---------------------------------------------------
  private getAll(_request: RoutedRequest<void>): Promise<IResult<Array<GameFormatDto>>> {
    return container.resolve<IGameFormatRepository>(REPOSITORIES.GameFormatRepository).getAll();
  }
  //#endregion
}
