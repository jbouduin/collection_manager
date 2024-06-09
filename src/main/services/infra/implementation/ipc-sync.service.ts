import { container, inject, singleton } from "tsyringe";

import { DtoSyncParam } from "../../../../common/dto";
import { CardSyncOptions, CatalogSyncOptions, SyncOptions, SyncParam } from "../../../../common/ipc-params";
import SYNCTOKENS, { ICardSetSyncService, ICardSymbolSyncService, ICardSyncService, ICatalogSyncService } from "../../scryfall";
import { IUntypedBaseSyncService } from "../../scryfall/sync/interface/base-sync.service";
import INFRATOKENS, { IIpcSyncService, IWindowService } from "../interfaces";
import { runSerial } from "../util";
import { BrowserWindow } from "electron";


export interface taskParam {
  displayName: string;
  serviceToken: string;
  syncParam: DtoSyncParam;
  browserWindow: BrowserWindow;
}

@singleton()
export class IpcSyncService implements IIpcSyncService {

  private readonly windowService: IWindowService;

  public constructor(@inject(INFRATOKENS.WindowService) windowService: IWindowService) {
    this.windowService = windowService;
  }

  public async newHandle(syncParam: DtoSyncParam, browserWindow: BrowserWindow): Promise<void> {
    console.log("start new IpcSyncService.handling", syncParam);

    const taskParams = new Array<taskParam>();
    if (syncParam.cardSyncType != "none") {
      taskParams.push({
        displayName: "Cards",
        serviceToken: SYNCTOKENS.CardSyncService,
        syncParam: syncParam,
        browserWindow: browserWindow
      });
    }
    if (syncParam.rulingSyncType != "none") {
      taskParams.push({
        displayName: "Rulings",
        serviceToken: SYNCTOKENS.RulingSyncService,
        syncParam: syncParam,
        browserWindow: browserWindow
      });
    }
    if (syncParam.syncCardSymbols) {
      taskParams.push({
        displayName: "CardSymbol",
        serviceToken: SYNCTOKENS.CardSymbolSyncService,
        syncParam: syncParam,
        browserWindow: browserWindow
      });
    }
    if (syncParam.syncCardSets) {
      taskParams.push({
        displayName: "CardSets",
        serviceToken: SYNCTOKENS.CardSetSyncService,
        syncParam: syncParam,
        browserWindow: browserWindow
      });
    }
    if (syncParam.catalogTypesToSync.length > 0) {
      taskParams.push({
        displayName: "Catalog",
        serviceToken: SYNCTOKENS.CatalogSyncService,
        syncParam: syncParam,
        browserWindow: browserWindow
      });
    }

    browserWindow.webContents.send("splash", "Start synchronization");
    try {
      return await runSerial<taskParam>(
        taskParams,
        (taskParam: taskParam) => `Serial task: ${taskParam.displayName}`,
        this.handleTask.bind(this));
    } catch (error) {
      console.log(error);
    } finally {
      browserWindow.webContents.send("splash-end");
    }
  }

  private async handleTask(taskParam: taskParam, _index: number, _total: number): Promise<void> {
    const synchronizer = container.resolve<IUntypedBaseSyncService>(taskParam.serviceToken);
    return synchronizer.newSync(
      taskParam.syncParam,
      (value: string) => taskParam.browserWindow.webContents.send("splash", value)
    );
  }

  public async handle(params: SyncParam<SyncOptions>): Promise<void> {
    console.log("start IpcSyncService.handling", params);

    this.windowService.mainWindow.webContents.send("splash", `Start sync ${params.type}`);
    try {
      switch (params.type) {
        case "CardSet":
          await container.resolve<ICardSetSyncService>(SYNCTOKENS.CardSetSyncService)
            .sync({ source: "user", code: null }, (value: string) => this.windowService.mainWindow.webContents.send("splash", value))
            .then(() => this.windowService.mainWindow.webContents.send("splash-end"));
          break;
        case "Card":
          await container.resolve<ICardSyncService>(SYNCTOKENS.CardSyncService)
            .sync(
              (params as SyncParam<CardSyncOptions>).options,
              (value: string) => this.windowService.mainWindow.webContents.send("splash", value)
            )
            .then(() => this.windowService.mainWindow.webContents.send("splash-end"));
          break;
        case "Catalog":
          await container.resolve<ICatalogSyncService>(SYNCTOKENS.CatalogSyncService)
            .sync(
              (params as SyncParam<CatalogSyncOptions>).options,
              (value: string) => this.windowService.mainWindow.webContents.send("splash", value)
            )
            .then(() => this.windowService.mainWindow.webContents.send("splash-end"));
          break;
        case "CardSymbol":
          await container.resolve<ICardSymbolSyncService>(SYNCTOKENS.CardSymbolSyncService)
            .sync(
              { source: "user" },
              (value: string) => this.windowService.mainWindow.webContents.send("splash", value)
            )
            .then(() => this.windowService.mainWindow.webContents.send("splash-end"));
          break;
      }
    } catch (error) {
      () => this.windowService.mainWindow.webContents.send("splash-end");
      throw error;
    }
  }
}
