import { ipcMain, nativeTheme } from "electron";
import { container, inject, singleton } from "tsyringe";

import { DarkmodeOption } from "../../../../common/ipc-params";
import INFRATOKENS, { IIpcDispatcherService, IIpcQueryService, IIpcSyncService, IWindowService } from "../interfaces";
import { IIpcPostService } from "../interfaces/ipc-post.service";

@singleton()
export class IpcDispatcherService implements IIpcDispatcherService{

  private readonly windowService: IWindowService;

  public constructor(@inject(INFRATOKENS.WindowService) windowService: IWindowService) {
    this.windowService = windowService;
  }

  //#region IIpcDispatcherService methods -------------------------------------
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  public Initialize(): IIpcDispatcherService {
    ipcMain.handle("darkmode", (_event: Electron.IpcMainEvent, ...args: Array<any>) => this.handleDarkMode(args[0]));
    ipcMain.handle("query", (_event: Electron.IpcMainEvent, ...args: Array<any>) => container.resolve<IIpcQueryService>(INFRATOKENS.IpcQueryService).handle(args[0]));
    ipcMain.handle("sync", (_event: Electron.IpcMainEvent, ...args: Array<any>) => container.resolve<IIpcSyncService>(INFRATOKENS.IpcSyncService).handle(args[0], this.windowService.mainWindow));
    ipcMain.handle("post", (_event: Electron.IpcMainEvent, ...args: Array<any>) => container.resolve<IIpcPostService>(INFRATOKENS.IpcPostService).handle(args[0]));
    return this;
  }
  /* eslint-enable  @typescript-eslint/no-explicit-any */
  //#endregion

  //#region auxiliary methods -------------------------------------------------
  private handleDarkMode(...args: Array<DarkmodeOption>): boolean {
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
  //#endregion
}
