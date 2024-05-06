import { ipcMain, nativeTheme } from "electron";
import { inject, singleton } from "tsyringe";
import { DarkmodeOption } from "../../../../common/ipc-params";
import INFRATOKENS, { IIpcDispatcherService, IIpcQueryOrSyncService, IIpcQueryService, IIpcSyncService } from "../interfaces";

@singleton()
export class IpcDispatcherService implements IIpcDispatcherService{

  private readonly ipcQueryOrSyncService: IIpcQueryOrSyncService;
  private readonly ipcQueryService: IIpcQueryService;
  private readonly ipcSyncService: IIpcSyncService;

  public constructor(
    @inject(INFRATOKENS.IpcQueryOrSyncService) ipcQueryOrSyncService: IIpcQueryOrSyncService,
    @inject(INFRATOKENS.IpcQueryService) ipcQueryService: IIpcQueryService,
    @inject(INFRATOKENS.IpcSyncService) ipcSyncService: IIpcSyncService
  )  {
    this.ipcQueryOrSyncService = ipcQueryOrSyncService;
    this.ipcQueryService = ipcQueryService;
    this.ipcSyncService = ipcSyncService;
  }

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  public Initialize(): void {
    ipcMain.handle("darkmode", (_event: Electron.IpcMainEvent, ...args: Array<any>) => this.handelDarkMode(args[0]));
    ipcMain.handle("ping", () => "pong");
    ipcMain.handle("query", (_event: Electron.IpcMainEvent, ...args: Array<any>) => this.ipcQueryService.handle(args[0]));
    ipcMain.handle("queryOrSync", (_event: Electron.IpcMainEvent, ...args: Array<any>) => this.ipcQueryOrSyncService.handle(args[0]));
    ipcMain.handle("sync", (_event: Electron.IpcMainEvent, ...args: Array<any>) => this.ipcSyncService.handle(args[0]));
  }
  /* eslint-enable  @typescript-eslint/no-explicit-any */

  private handelDarkMode(...args: Array<DarkmodeOption>): boolean {
    const option = args[0] as DarkmodeOption;
    switch (option) {
      case "system":
        nativeTheme.themeSource = "system";
        return nativeTheme.shouldUseDarkColors;
      case "toggle":
        if (nativeTheme.shouldUseDarkColors) {
          nativeTheme.themeSource = "light";
        } else {
          nativeTheme.themeSource = "dark";
        }
        return nativeTheme.shouldUseDarkColors;
    }
  }
}
