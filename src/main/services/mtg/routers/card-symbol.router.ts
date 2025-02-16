import { inject, singleton } from "tsyringe";
import { DtoCardSymbol } from "../../../../common/dto";
import { ICardSymbolRepository } from "../../../database/repo/interfaces";
import { BaseRouter, IResult, IRouter, RouteCallback, RoutedRequest } from "../../base";
import { IImageCacheService, ILogService, IResultFactory, IRouterService } from "../../infra/interfaces";
import { INFRASTRUCTURE, REPOSITORIES } from "../../service.tokens";
import { Selectable } from "kysely";
import { CardSymbolTable } from "../../../database/schema";


@singleton()
export class CardSymbolRouter extends BaseRouter implements IRouter {
  //#region Private fields ----------------------------------------------------
  private readonly cardSymbolRepository: ICardSymbolRepository;
  private imageCacheService: IImageCacheService;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(
    @inject(REPOSITORIES.CardSymbolRepository) cardSymbolRepository: ICardSymbolRepository,
    @inject(INFRASTRUCTURE.LogService) logService: ILogService,
    @inject(INFRASTRUCTURE.ImageCacheService) imageCacheService: IImageCacheService,
    @inject(INFRASTRUCTURE.ResultFacotry) resultFactory: IResultFactory
  ) {
    super(logService, resultFactory);
    this.cardSymbolRepository = cardSymbolRepository;
    this.imageCacheService = imageCacheService;
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
    return this.cardSymbolRepository
      .getCardSymbols()
      .then(
        (r: IResult<Array<Selectable<CardSymbolTable>>>) => {
          const result = new Map<string, string>();
          r.data.forEach((cardSymbol: Selectable<CardSymbolTable>) => result.set(cardSymbol.id, this.imageCacheService.getCardSymbolSvg(cardSymbol)));
          return this.resultFactory.createSuccessResult<Map<string, string>>(result);
        },
        (r: IResult<Array<Selectable<CardSymbolTable>>>) => r.convert<Map<string, string>>(
          () => new Map<string, string>(),
          () => new Map<string, string>()
        )
      );
  }
  //#endregion
}
