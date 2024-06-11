import { container, inject, singleton } from "tsyringe";

import { BrowserWindow } from "electron";
import { DtoSyncParam } from "../../../../common/dto";
import SYNCTOKENS from "../../scryfall";
import INFRATOKENS, { IIpcSyncService, IWindowService } from "../interfaces";
import { runSerial } from "../util";
import { IBaseSyncService } from "../../scryfall/sync/interface/base-sync.service";


interface SyncTaskParam {
  displayName: string;
  serviceToken: string;
  syncParam: DtoSyncParam;
  browserWindow: BrowserWindow;
}

@singleton()
export class IpcSyncService implements IIpcSyncService {

  //#region private readonly fields -------------------------------------------
  private readonly windowService: IWindowService;
  //#endregion

  //#region Constructor -------------------------------------------------------
  public constructor(@inject(INFRATOKENS.WindowService) windowService: IWindowService) {
    this.windowService = windowService;
  }
  //#endregion

  //#region IIpcSyncService methods -------------------------------------------
  public async handle(syncParam: DtoSyncParam, browserWindow: BrowserWindow): Promise<void> {
    console.log("start new IpcSyncService.handling", syncParam);

    const taskParams = new Array<SyncTaskParam>();
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
      return await runSerial<SyncTaskParam>(
        taskParams,
        this.handleTask.bind(this));
    } catch (error) {
      console.log(error);
    } finally {
      browserWindow.webContents.send("splash-end");
    }
  }
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  private async handleTask(taskParam: SyncTaskParam, _index: number, _total: number): Promise<void> {
    const synchronizer = container.resolve<IBaseSyncService>(taskParam.serviceToken);
    return synchronizer.sync(
      taskParam.syncParam,
      (value: string) => {
        taskParam.browserWindow.webContents.send("splash", value);
        console.log(value);
      }
    );
  }
  //#endregion
}
