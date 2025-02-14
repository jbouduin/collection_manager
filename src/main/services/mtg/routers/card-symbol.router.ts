import { inject, singleton } from "tsyringe";
import { DtoCardSymbol } from "../../../../common/dto";
import { ICardSymbolRepository } from "../../../database/repo/interfaces";
import { BaseRouter, IResult, IRouter, RouteCallback, RoutedRequest } from "../../base";
import { ILogService, IResultFactory, IRouterService } from "../../infra/interfaces";
import { INFRASTRUCTURE, REPOSITORIES } from "../../service.tokens";


@singleton()
export class CardSymbolRouter extends BaseRouter implements IRouter {
  //#region Private fields ----------------------------------------------------
  private readonly cardSymbolRepository: ICardSymbolRepository;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(
    @inject(REPOSITORIES.CardSymbolRepository) cardSymbolRepository: ICardSymbolRepository,
    @inject(INFRASTRUCTURE.LogService) logService: ILogService,
    @inject(INFRASTRUCTURE.ResultFacotry) resultFactory: IResultFactory
  ) {
    super(logService, resultFactory);
    this.cardSymbolRepository = cardSymbolRepository;
  }
  //#endregion

  //#region IRouteDestinationService methods ----------------------------------
  public setRoutes(router: IRouterService): void {
    router.registerGetRoute("/card-symbol", this.getAll.bind(this) as RouteCallback);
    router.registerGetRoute("/card-symbol/svg", this.getSvg.bind(this) as RouteCallback);
  }
  //#endregion

  //#region Route callbacks ---------------------------------------------------
  private getAll(_request: RoutedRequest<void>): Promise<IResult<Array<DtoCardSymbol>>> {
    return this.cardSymbolRepository.getAll();
  }

  private getSvg(_request: RoutedRequest<void>): Promise<IResult<Map<string, string>>> {
    return this.cardSymbolRepository.getCardSymbolSvg();
  }
  //#endregion
}
