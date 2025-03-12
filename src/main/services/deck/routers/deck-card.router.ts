import { container, inject, singleton } from "tsyringe";
import { IDeckCardListDto, IUpdateDeckCardQuantityDto } from "../../../../common/dto";
import { IDeckRepository } from "../../../database/repo/interfaces";
import { BaseRouter, DeleteRouteCallback, IResult, IRouter, RouteCallback, RoutedRequest } from "../../base";
import { ILogService, IResultFactory, IRouterService } from "../../infra/interfaces";
import { INFRASTRUCTURE, REPOSITORIES } from "../../service.tokens";


@singleton()
export class DeckCardRouter extends BaseRouter implements IRouter {
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
    router.registerDeleteRoute("/deck-card/:id", this.deleteDeckCard.bind(this) as DeleteRouteCallback);
    router.registerPatchRoute("/deck-card/:id/quantity", this.updateDeckCardQuantity.bind(this) as RouteCallback);
  }
  //#endregion

  //#region Route callbacks ---------------------------------------------------
  private deleteDeckCard(request: RoutedRequest<void>): Promise<IResult<number>> {
    return this.parseIntegerUrlParameter(request.params["id"], "Deck ID")
      .continueAsync<number>(
        (r: IResult<number>) => container.resolve<IDeckRepository>(REPOSITORIES.DeckRepository).deleteDeckCard(r.data),
        (r: IResult<number>) => Promise.resolve(r)
      );
  }

  private updateDeckCardQuantity(request: RoutedRequest<IUpdateDeckCardQuantityDto>): Promise<IResult<IDeckCardListDto>> {
    return this.parseIntegerUrlParameter(request.params["id"], "Deck ID")
      .continueAsync<IDeckCardListDto>(
        (r: IResult<number>) => {
          if (r.data != request.data.deck_card_id) {
            return this.resultFactory.createBadRequestResultPromise<IDeckCardListDto>("Datafield ID in the body does not correspond to the URL.");
          } else {
            if (request.data.deck_quantity + request.data.sideboard_quantity > 0) {
              return container.resolve<IDeckRepository>(REPOSITORIES.DeckRepository).updateDeckCardQuantity(request.data);
            } else {
              return this.resultFactory.createBadRequestResultPromise<IDeckCardListDto>("Quantity for card in deck and sideboard is 0.");
            }
          }
        },
        (r: IResult<number>) => r.castAsync<IDeckCardListDto>(undefined)
      );
  }
  //#endregion
}
