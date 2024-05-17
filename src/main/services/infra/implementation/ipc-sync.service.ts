import { container, inject, singleton } from "tsyringe";

import { CardSetSyncOptions, CardSyncOptions, CatalogSyncOptions, IQueryParam, QueryOptions } from "../../../../common/ipc-params";
import SYNCTOKENS, { ICardSetSyncService, ICardSyncService, ICatalogSyncService, ISymbologySyncService } from "../../scryfall";
import INFRATOKENS, { IIpcSyncService, IWindowService } from "../interfaces";


@singleton()
export class IpcSyncService implements IIpcSyncService {

  private readonly windowService: IWindowService;

  public constructor(@inject(INFRATOKENS.WindowService) windowService: IWindowService) {
    this.windowService = windowService;
  }

  public async handle(params: IQueryParam<QueryOptions>): Promise<void> {
    console.log("start IpcSyncService.handling", params);
    const splashWindow = this.windowService.createSplashWindow();
    splashWindow.on("ready-to-show", async () => {
      splashWindow.show();
      splashWindow.webContents.send("splash", `Start sync ${params.type}`);
      switch (params.type) {
        case "CardSet":
          await container.resolve<ICardSetSyncService>(SYNCTOKENS.CardSetSyncService)
            .sync(
              (params as IQueryParam<CardSetSyncOptions>).options,
              (value: string) => splashWindow.webContents.send("splash", value)
            )
            .then(() => splashWindow.close());
          break;
        case "Card":
          await container.resolve<ICardSyncService>(SYNCTOKENS.CardSyncService)
            .sync(
              (params as IQueryParam<CardSyncOptions>).options,
              (value: string) => splashWindow.webContents.send("splash", value)
            )
            .then(() => splashWindow.close());
          break;
        case "Catalog":
          await container.resolve<ICatalogSyncService>(SYNCTOKENS.CatalogSyncService)
            .sync(
              (params as IQueryParam<CatalogSyncOptions>).options,
              (value: string) => splashWindow.webContents.send("splash", value)
            )
            .then(() => splashWindow.close());
          break;
        case "Symbology":
          await container.resolve<ISymbologySyncService>(SYNCTOKENS.SymbologySyncService)
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
