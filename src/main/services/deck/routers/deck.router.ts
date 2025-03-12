import { container, inject, singleton } from "tsyringe";
import { IDeckCardListDto, IDeckDetailDto, IDeckDto, IDeckFolderDto, IDeckListDto } from "../../../../common/dto";
import { IDeckRepository } from "../../../database/repo/interfaces";
import { BaseRouter, DeleteRouteCallback, IResult, IRouter, RouteCallback, RoutedRequest } from "../../base";
import { ILogService, IResultFactory, IRouterService } from "../../infra/interfaces";
import { INFRASTRUCTURE, REPOSITORIES } from "../../service.tokens";


@singleton()
export class DeckRouter extends BaseRouter implements IRouter {
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
    router.registerDeleteRoute("/deck/:id", this.deleteDeck.bind(this) as DeleteRouteCallback);
    router.registerGetRoute("/deck/folder", this.getAllFolders.bind(this) as RouteCallback);
    router.registerGetRoute("/deck/folder/:id/deck", this.getAllDecksInFolder.bind(this) as RouteCallback);
    router.registerGetRoute("/deck/:id/card", this.getAllCardsOfDeck.bind(this) as RouteCallback);
    router.registerGetRoute("/deck/:id", this.getDeckDetails.bind(this) as RouteCallback);
    router.registerPatchRoute("/deck/:id", this.patchDeck.bind(this) as RouteCallback);
    router.registerPostRoute("/deck", this.createDeck.bind(this) as RouteCallback);
  }
  //#endregion

  //#region Route callbacks ---------------------------------------------------
  private createDeck(request: RoutedRequest<IDeckListDto>): Promise<IResult<IDeckDto>> {
    return container.resolve<IDeckRepository>(REPOSITORIES.DeckRepository).createDeck(request.data);
  }

  private deleteDeck(request: RoutedRequest<void>): Promise<IResult<number>> {
    return this.parseIntegerUrlParameter(request.params["id"], "Deck ID")
      .continueAsync<number>(
        (r: IResult<number>) => container.resolve<IDeckRepository>(REPOSITORIES.DeckRepository).deleteDeck(r.data),
        (r: IResult<number>) => Promise.resolve(r)
      );
  }

  private getAllFolders(_request: RoutedRequest<void>): Promise<IResult<Array<IDeckFolderDto>>> {
    return container.resolve<IDeckRepository>(REPOSITORIES.DeckRepository).getAllFolders();
  }

  private getAllDecksInFolder(request: RoutedRequest<void>): Promise<IResult<Array<IDeckListDto>>> {
    return this.parseIntegerUrlParameter(request.params["id"], "Folder ID")
      .continueAsync<Array<IDeckListDto>>(
        (r: IResult<number>) => container.resolve<IDeckRepository>(REPOSITORIES.DeckRepository).getAllDecksInFolder(r.data),
        (r: IResult<number>) => r.castAsync<Array<IDeckListDto>>(undefined)
      );
  }

  private getAllCardsOfDeck(request: RoutedRequest<void>): Promise<IResult<Array<IDeckCardListDto>>> {
    return this.parseIntegerUrlParameter(request.params["id"], "Deck ID")
      .continueAsync<Array<IDeckCardListDto>>(
        (r: IResult<number>) => container.resolve<IDeckRepository>(REPOSITORIES.DeckRepository).getAllCardsOfDeck(r.data),
        (r: IResult<number>) => r.castAsync<Array<IDeckCardListDto>>(undefined)
      );
  }

  private getDeckDetails(request: RoutedRequest<void>): Promise<IResult<IDeckDetailDto>> {
    return this.parseIntegerUrlParameter(request.params["id"], "Deck ID")
      .continueAsync<IDeckDetailDto>(
        (r: IResult<number>) => container.resolve<IDeckRepository>(REPOSITORIES.DeckRepository).getDeckDetails(r.data),
        (r: IResult<number>) => r.castAsync<IDeckListDto>(undefined)
      );
  }

  private patchDeck(request: RoutedRequest<Partial<IDeckListDto>>): Promise<IResult<IDeckDto>> {
    return this.parseIntegerUrlParameter(request.params["id"], "Deck ID")
      .continueAsync<IDeckDto>(
        (r: IResult<number>) => {
          if (r.data != request.data.id) {
            return this.resultFactory.createBadRequestResultPromise<IDeckListDto>("Datafield ID in the body does not correspond to the URL.");
          } else {
            return container.resolve<IDeckRepository>(REPOSITORIES.DeckRepository).patchDeck(request.data);
          }
        },
        (r: IResult<number>) => r.castAsync<IDeckListDto>(undefined)
      );
  }
  //#endregion
}
