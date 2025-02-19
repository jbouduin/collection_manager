import { inject, singleton } from "tsyringe";
import { CardConditionDto } from "../../../../common/dto";
import { ICardConditionRepository } from "../../../database/repo/interfaces";
import { BaseRouter, IResult, IRouter, RouteCallback, RoutedRequest } from "../../base";
import { ILogService, IResultFactory, IRouterService } from "../../infra/interfaces";
import { INFRASTRUCTURE, REPOSITORIES } from "../../service.tokens";


@singleton()
export class CardConditionRouter extends BaseRouter implements IRouter {
  //#region Private fields ----------------------------------------------------
  private readonly cardConditionRepository: ICardConditionRepository;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(
    @inject(REPOSITORIES.CardConditionRepository) cardConditionRepository: ICardConditionRepository,
    @inject(INFRASTRUCTURE.LogService) logService: ILogService,
    @inject(INFRASTRUCTURE.ResultFacotry) resultFactory: IResultFactory
  ) {
    super(logService, resultFactory);
    this.cardConditionRepository = cardConditionRepository;
  }
  //#endregion

  //#region IRouteDestinationService methods ----------------------------------
  public setRoutes(router: IRouterService): void {
    router.registerGetRoute("/card-condition", this.getAll.bind(this) as RouteCallback);
  }
  //#endregion

  //#region Route callbacks ---------------------------------------------------
  private getAll(_request: RoutedRequest<void>): Promise<IResult<Array<CardConditionDto>>> {
    return this.cardConditionRepository.getAll();
  }
  //#endregion
}
