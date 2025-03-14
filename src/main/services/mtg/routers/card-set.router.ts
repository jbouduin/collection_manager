import { inject, singleton } from "tsyringe";
import { IMtgCardSetDetailDto, IMtgCardSetDto } from "../../../../common/dto";
import { ICardRepository, ICardSetRepository } from "../../../database/repo/interfaces";
import { BaseRouter, IResult, IRouter, RouteCallback, RoutedRequest } from "../../base";
import { ILogService, IResultFactory, IRouterService } from "../../infra/interfaces";
import { INFRASTRUCTURE, REPOSITORIES } from "../../service.tokens";


@singleton()
export class CardSetRouter extends BaseRouter implements IRouter {
  //#region Private fields ----------------------------------------------------
  private readonly cardRepository: ICardRepository;
  private readonly cardSetRepository: ICardSetRepository;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(
    @inject(REPOSITORIES.CardRepository) cardRepository: ICardRepository,
    @inject(REPOSITORIES.CardSetRepository) cardSetRepository: ICardSetRepository,
    @inject(INFRASTRUCTURE.LogService) logService: ILogService,
    @inject(INFRASTRUCTURE.ResultFacotry) resultFactory: IResultFactory
  ) {
    super(logService, resultFactory);
    this.cardRepository = cardRepository;
    this.cardSetRepository = cardSetRepository;
  }
  //#endregion

  //#region IRouteDestinationService methods ----------------------------------
  public setRoutes(router: IRouterService): void {
    router.registerGetRoute("/card-set", this.getAll.bind(this) as RouteCallback);
    router.registerGetRoute("/card-set/:id", this.getDetails.bind(this) as RouteCallback);
  }
  //#endregion

  //#region Route callbacks ---------------------------------------------------
  private getAll(_request: RoutedRequest<void>): Promise<IResult<Array<IMtgCardSetDto>>> {
    return this.cardSetRepository.getAll();
  }

  private getDetails(request: RoutedRequest<void>): Promise<IResult<IMtgCardSetDetailDto>> {
    return this.cardSetRepository.getDetails(request.params["id"]);
  }
  //#endregion
}
