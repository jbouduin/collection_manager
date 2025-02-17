import { container, inject, singleton } from "tsyringe";
import { CardDto, RulingLineDto, RulingSyncParam } from "../../../../common/dto";
import { ICardRepository, IOracleRepository } from "../../../database/repo/interfaces";
import { BaseRouter, IResult, IRouter, RouteCallback, RoutedRequest } from "../../base";
import { ILogService, IResultFactory, IRouterService } from "../../infra/interfaces";
import { IRulingSyncService } from "../../scryfall";
import { INFRASTRUCTURE, REPOSITORIES, SCRYFALL } from "../../service.tokens";


@singleton()
export class CardRouter extends BaseRouter implements IRouter {
  //#region Private fields ----------------------------------------------------
  private readonly cardRepository: ICardRepository;
  private readonly oracleRepository: IOracleRepository;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(
    @inject(REPOSITORIES.CardRepository) cardRepository: ICardRepository,
    @inject(REPOSITORIES.OracleRepository) oracleRepository: IOracleRepository,
    @inject(INFRASTRUCTURE.LogService) logService: ILogService,
    @inject(INFRASTRUCTURE.ResultFacotry) resultFactory: IResultFactory
  ) {
    super(logService, resultFactory);
    this.cardRepository = cardRepository;
    this.oracleRepository = oracleRepository;
  }
  //#endregion

  //#region IRouteDestinationService methods ----------------------------------
  public setRoutes(router: IRouterService): void {
    router.registerGetRoute("/card/:id/ruling", this.getRuling.bind(this) as RouteCallback);
    router.registerGetRoute("/card/query", this.queryCards.bind(this) as RouteCallback);
    router.registerGetRoute("/card/:id", this.getCard.bind(this) as RouteCallback);
  }
  //#endregion

  //#region Route callbacks ---------------------------------------------------
  private getCard(request: RoutedRequest<void>): Promise<IResult<CardDto>> {
    return this.cardRepository.getCards(request.params["id"])
      .then((r: IResult<Array<CardDto>>) => {
        return r.data.length > 0
          ? this.resultFactory.createSuccessResult<CardDto>(r.data[0])
          : this.resultFactory.createNotFoundResult<CardDto>(request.params["id"]);
      });
  }

  private getRuling(request: RoutedRequest<void>): Promise<IResult<Array<RulingLineDto>>> {
    return this.oracleRepository
      .getByCardId(request.params["id"])
      .then((queryResult: IResult<Array<RulingLineDto>>) => {
        if (queryResult.data.length == 0) {
          // LATER refactor sync (also check if we really need adapters)
          const syncParam: RulingSyncParam = {
            rulingSyncType: "selectionOfCards",
            cardSelectionToSync: [request.params["id"]]
          };
          return container.resolve<IRulingSyncService>(SCRYFALL.RulingSyncService)
            .sync(syncParam, (s: string) => this.logService.debug("Main", s))
            .then(() => {
              return this.oracleRepository
                .getByCardId(request.params["id"])
                .then((afterSync: IResult<Array<RulingLineDto>>) => {
                  return afterSync.processResult((r: IResult<Array<RulingLineDto>>) => r.data = r.data.filter((line: RulingLineDto) => line.oracle_id !== null));
                });
            });
        } else {
          return queryResult.processResult((r: IResult<Array<RulingLineDto>>) => r.data = r.data.filter((line: RulingLineDto) => line.oracle_id !== null));
        }
      });
  }

  private queryCards(request: RoutedRequest<void>): Promise<IResult<Array<CardDto>>> {
    return this.cardRepository.getCards(undefined, request.queryParams["sets"].split(","));
  }
  //#endregion
}
