import { container, inject, singleton } from "tsyringe";
import { LegalityDto, RulingLineDto, RulingSyncParam } from "../../../../common/dto";
import { IOracleRepository } from "../../../database/repo/interfaces";
import { BaseRouter, IResult, IRouter, RouteCallback, RoutedRequest } from "../../base";
import { ILogService, IResultFactory, IRouterService } from "../../infra/interfaces";
import { INFRASTRUCTURE, REPOSITORIES, SCRYFALL } from "../../service.tokens";
import { IRulingSyncService } from "../../scryfall";


@singleton()
export class OracleRouter extends BaseRouter implements IRouter {
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
    router.registerGetRoute("/oracle/:id/legality", this.getLegalities.bind(this) as RouteCallback);
    router.registerGetRoute("/oracle/:id/ruling", this.getRulings.bind(this) as RouteCallback);
  }
  //#endregion

  //#region Route callbacks ---------------------------------------------------
  private getLegalities(request: RoutedRequest<void>): Promise<IResult<Array<LegalityDto>>> {
    return container.resolve<IOracleRepository>(REPOSITORIES.OracleRepository).getLegalities(request.params["id"]);
  }

  private getRulings(request: RoutedRequest<void>): Promise<IResult<Array<RulingLineDto>>> {
    const oracleId = request.params["id"];
    const oracleRepository = container.resolve<IOracleRepository>(REPOSITORIES.OracleRepository);
    return oracleRepository
      .getByOracleId(oracleId)
      .then((queryResult: IResult<Array<RulingLineDto>>) => {
        if (queryResult.data.length == 0) {
          const syncParam: RulingSyncParam = {
            rulingSyncType: "oracleId",
            cardSelectionToSync: null,
            oracleId: oracleId
          };
          return container.resolve<IRulingSyncService>(SCRYFALL.RulingSyncService)
            .sync(syncParam, (s: string) => this.logService.debug("Main", s))
            .then(() => {
              return oracleRepository
                .getByOracleId(oracleId)
                .then((afterSync: IResult<Array<RulingLineDto>>) => {
                  return afterSync.processResult((r: IResult<Array<RulingLineDto>>) => r.data = r.data.filter((line: RulingLineDto) => line.oracle_id !== null));
                });
            });
        } else {
          return queryResult.processResult((r: IResult<Array<RulingLineDto>>) => r.data = r.data.filter((line: RulingLineDto) => line.oracle_id !== null));
        }
      });
  }
  //#endregion
}
