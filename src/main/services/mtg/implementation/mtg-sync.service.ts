import { WebContents } from "electron";
import { container, inject, singleton } from "tsyringe";
import { ICardSyncParam, IRulingSyncParam, ISyncParamDto } from "../../../../common/dto";
import { CatalogType } from "../../../../common/types";
import { runSerial } from "../../infra/util";
import { ICardSetSyncService, ICardSymbolSyncService, ICardSyncService, ICatalogSyncService, IRulingSyncService } from "../../scryfall";
import { BaseSyncService } from "../../scryfall/sync/implementation/base-sync.service";
import { INFRASTRUCTURE, SCRYFALL } from "../../service.tokens";
import { IMtgSyncService } from "../interfaces";
import { ILogService } from "../../infra/interfaces";


interface SyncTaskParam<T> {
  displayName: string;
  syncParam: T;
  webContents: WebContents;
  handler: BaseSyncService<T>;
}

@singleton()
export class MtgSyncService implements IMtgSyncService {
  //#region private fields ----------------------------------------------------
  private readonly logService: ILogService;
  //#endregion

  //#region Constructor -------------------------------------------------------
  public constructor(@inject(INFRASTRUCTURE.LogService) logService: ILogService) {
    this.logService = logService;
  }
  //#endregion

  //#region IMtgSyncService methods -------------------------------------------
  public async synchronize(syncParam: ISyncParamDto, webContents: WebContents): Promise<void> {
    const taskParams = new Array<SyncTaskParam<unknown>>();
    if (syncParam.cardSyncType != "none") {
      taskParams.push({
        displayName: "Cards",
        syncParam: syncParam as ICardSyncParam,
        webContents: webContents,
        handler: container.resolve<ICardSyncService>(SCRYFALL.CardSyncService) as BaseSyncService<ICardSyncParam>
      });
    }
    if (syncParam.rulingSyncType != "none") {
      taskParams.push({
        displayName: "Rulings",
        syncParam: syncParam as IRulingSyncParam,
        webContents: webContents,
        handler: container.resolve<IRulingSyncService>(SCRYFALL.RulingSyncService) as BaseSyncService<IRulingSyncParam>
      });
    }
    if (syncParam.syncCardSymbols) {
      taskParams.push({
        displayName: "CardSymbol",
        syncParam: undefined,
        webContents: webContents,
        handler: container.resolve<ICardSymbolSyncService>(SCRYFALL.CardSymbolSyncService) as BaseSyncService<void>
      });
    }
    if (syncParam.syncCardSets) {
      taskParams.push({
        displayName: "CardSets",
        syncParam: undefined,
        webContents: webContents,
        handler: container.resolve<ICardSetSyncService>(SCRYFALL.CardSetSyncService) as BaseSyncService<void>
      });
    }
    if (syncParam.catalogTypesToSync.length > 0) {
      taskParams.push({
        displayName: "Catalog",
        syncParam: syncParam.catalogTypesToSync,
        webContents: webContents,
        handler: container.resolve<ICatalogSyncService>(SCRYFALL.CatalogSyncService) as BaseSyncService<Array<CatalogType>>
      });
    }

    webContents.send("splash", "Start synchronization");
    try {
      /* eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument */
      return await runSerial<SyncTaskParam<unknown>>(taskParams, this.handleTask.bind(this));
    } catch (error: unknown) {
      this.logService.error("Main", "error during handling sync task", error);
    }
  }
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  private async handleTask(taskParam: SyncTaskParam<unknown>, _index: number, _total: number): Promise<void> {
    return taskParam.handler.sync(
      taskParam.syncParam,
      (value: string) => {
        taskParam.webContents.send("splash", value);
        this.logService.debug("Main", value);
      }
    );
  }
  //#endregion
}
