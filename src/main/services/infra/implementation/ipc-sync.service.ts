import { inject, singleton } from "tsyringe";

import { CardSetSyncOptions, CardSyncOptions, CatalogSyncOptions, IQueryOrSyncParam, QueryOrSyncOptions } from "../../../../common/ipc-params";
import SYNCTOKENS, { ICardSetSyncService, ICardSyncService, ICatalogSyncService, ISymbologySyncService } from "../../sync/interfaces";
import INFRATOKENS, { IIpcSyncService, IWindowService } from "../interfaces";


@singleton()
export class IpcSyncService implements IIpcSyncService {

  private readonly cardSetSyncService: ICardSetSyncService;
  private readonly cardSyncService: ICardSyncService;
  private readonly catalogSyncService: ICatalogSyncService;
  private readonly symbologySyncService: ISymbologySyncService;
  private readonly windowService: IWindowService;

  public constructor(
    @inject(SYNCTOKENS.CardSetSyncService) cardSetSyncService: ICardSetSyncService,
    @inject(SYNCTOKENS.CardSyncService) cardSyncService: ICardSyncService,
    @inject(SYNCTOKENS.CatalogSyncService) catalogSyncService: ICatalogSyncService,

    @inject(SYNCTOKENS.SymbologySyncService) symbologySyncService: ISymbologySyncService,
    @inject(INFRATOKENS.WindowService) windowService: IWindowService
  ) {
    this.cardSetSyncService = cardSetSyncService;
    this.cardSyncService = cardSyncService;
    this.catalogSyncService = catalogSyncService;
    this.symbologySyncService = symbologySyncService;
    this.windowService = windowService;
  }

  public async handle(params: IQueryOrSyncParam<QueryOrSyncOptions>): Promise<void> {
    console.log("start IpcSyncService.handling", params);
    const splashWindow = this.windowService.createSplashWindow();
    splashWindow.on("ready-to-show", async () => {
      splashWindow.show();
      splashWindow.webContents.send("splash", `Start sync ${params.type}`);
      switch (params.type) {
        case "CardSet":
          await this.cardSetSyncService
            .sync(
              (params as IQueryOrSyncParam<CardSetSyncOptions>).options,
              (value: string) => splashWindow.webContents.send("splash", value)
            )
            .then(() => splashWindow.close());
          break;
        case "Card":
          await this.cardSyncService
            .sync(
              (params as IQueryOrSyncParam<CardSyncOptions>).options,
              (value: string) => splashWindow.webContents.send("splash", value)
            )
            .then(() => splashWindow.close());
          break;
        case "Catalog":
          await this.catalogSyncService
            .sync(
              (params as IQueryOrSyncParam<CatalogSyncOptions>).options,
              (value: string) => splashWindow.webContents.send("splash", value)
            )
            .then(() => splashWindow.close());
          break;
        case "Symbology":
          await this.symbologySyncService
            .sync(
              null,
              (value: string) => splashWindow.webContents.send("splash", value)
            )
            .then(() => splashWindow.close());
          break;
      }
    });
  }

}
