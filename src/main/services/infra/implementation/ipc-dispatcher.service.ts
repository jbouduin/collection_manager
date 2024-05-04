import { ipcMain, nativeTheme } from "electron";
import { inject, singleton } from "tsyringe";
import { DarkmodeOption } from "../../../../common/ipc-params";
import INFRATOKENS, { IIpcDispatcherService, IIpcQueryService, IIpcSyncService } from "../interfaces";

@singleton()
export class IpcDispatcherService implements IIpcDispatcherService{

  private readonly queryService: IIpcQueryService;
  private readonly updateService: IIpcSyncService;

  public constructor(
    @inject(INFRATOKENS.IpcQueryService) queryService: IIpcQueryService,
    @inject(INFRATOKENS.IpcSyncService) updateService: IIpcSyncService)
  {
    this.queryService = queryService;
    this.updateService = updateService;
  }

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  public Initialize(): void {
    ipcMain.handle("darkmode", (_event: Electron.IpcMainEvent, ...args: Array<any>) => this.handelDarkMode(args[0]));
    ipcMain.handle("ping", () => "pong");
    ipcMain.handle("query", (_event: Electron.IpcMainEvent, ...args: Array<any>) => this.queryService.handle(args[0]));
    ipcMain.handle("sync", (_event: Electron.IpcMainEvent, ...args: Array<any>) => this.updateService.handle(args[0]));
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
