import { container, inject, singleton } from "tsyringe";

import { CardSyncOptions, CatalogSyncOptions, SyncOptions, SyncParam } from "../../../../common/ipc-params";
import SYNCTOKENS, { ICardSetSyncService, ICardSymbolSyncService, ICardSyncService, ICatalogSyncService } from "../../scryfall";
import INFRATOKENS, { IIpcSyncService, IWindowService } from "../interfaces";


@singleton()
export class IpcSyncService implements IIpcSyncService {

  private readonly windowService: IWindowService;

  public constructor(@inject(INFRATOKENS.WindowService) windowService: IWindowService) {
    this.windowService = windowService;
  }

  public async handle(params: SyncParam<SyncOptions>): Promise<void> {
    console.log("start IpcSyncService.handling", params);

    this.windowService.mainWindow.webContents.send("splash", `Start sync ${params.type}`);
    try {
      switch (params.type) {
        case "CardSet":
          await container.resolve<ICardSetSyncService>(SYNCTOKENS.CardSetSyncService)
            .sync({ source: "user", code: null }, (value: string) => this.windowService.mainWindow.webContents.send("splash", value))
            .then(() => this.windowService.mainWindow.webContents.send("splash-close"));
          break;
        case "Card":
          await container.resolve<ICardSyncService>(SYNCTOKENS.CardSyncService)
            .sync(
              (params as SyncParam<CardSyncOptions>).options,
              (value: string) => this.windowService.mainWindow.webContents.send("splash", value)
            )
            .then(() => this.windowService.mainWindow.webContents.send("splash-close"));
          break;
        case "Catalog":
          await container.resolve<ICatalogSyncService>(SYNCTOKENS.CatalogSyncService)
            .sync(
              (params as SyncParam<CatalogSyncOptions>).options,
              (value: string) => this.windowService.mainWindow.webContents.send("splash", value)
            )
            .then(() => this.windowService.mainWindow.webContents.send("splash-close"));
          break;
        case "CardSymbol":
          await container.resolve<ICardSymbolSyncService>(SYNCTOKENS.CardSymbolSyncService)
            .sync(
              { source: "user" },
              (value: string) => this.windowService.mainWindow.webContents.send("splash", value)
            )
            .then(() => this.windowService.mainWindow.webContents.send("splash-close"));
          break;
      }
    } catch (error) {
      () => this.windowService.mainWindow.webContents.send("splash-close");
      throw error;
    }
  }
}
