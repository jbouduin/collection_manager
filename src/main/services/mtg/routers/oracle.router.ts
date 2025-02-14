import { inject, singleton } from "tsyringe";
import { LegalityDto } from "../../../../common/dto";
import { IOracleRepository } from "../../../database/repo/interfaces";
import { BaseRouter, IResult, IRouter, RouteCallback, RoutedRequest } from "../../base";
import { ILogService, IResultFactory, IRouterService } from "../../infra/interfaces";
import { INFRASTRUCTURE, REPOSITORIES } from "../../service.tokens";


@singleton()
export class OracleRouter extends BaseRouter implements IRouter {
  //#region Private fields ----------------------------------------------------
  private readonly oracleRepository: IOracleRepository;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(
    @inject(REPOSITORIES.OracleRepository) oracleRepository: IOracleRepository,
    @inject(INFRASTRUCTURE.LogService) logService: ILogService,
    @inject(INFRASTRUCTURE.ResultFacotry) resultFactory: IResultFactory
  ) {
    super(logService, resultFactory);
    this.oracleRepository = oracleRepository;
  }
  //#endregion

  //#region IRouteDestinationService methods ----------------------------------
  public setRoutes(router: IRouterService): void {
    // router.registerGetRoute("/card", this.getAll.bind(this) as RouteCallback);
    router.registerGetRoute("/oracle/:id/legality", this.getLegalities.bind(this) as RouteCallback);
  }
  //#endregion

  //#region Route callbacks ---------------------------------------------------
  private getLegalities(request: RoutedRequest<void>): Promise<IResult<Array<LegalityDto>>> {
    return this.oracleRepository.getLegalities(request.params["id"]);
  }
  //#endregion
}
