import { ipcMain, nativeTheme } from "electron";
import { container, singleton } from "tsyringe";

import { DarkmodeOption } from "../../../../common/ipc-params";
import INFRATOKENS, { IIpcDispatcherService, IIpcQueryService, IIpcSyncService } from "../interfaces";

@singleton()
export class IpcDispatcherService implements IIpcDispatcherService{

  //#region IIpcDispatcherService methods -------------------------------------
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  public Initialize(): void {
    ipcMain.handle("darkmode", (_event: Electron.IpcMainEvent, ...args: Array<any>) => this.handelDarkMode(args[0]));
    ipcMain.handle("query", (_event: Electron.IpcMainEvent, ...args: Array<any>) => container.resolve<IIpcQueryService>(INFRATOKENS.IpcQueryService).handle(args[0]));
    ipcMain.handle("sync", (_event: Electron.IpcMainEvent, ...args: Array<any>) => container.resolve<IIpcSyncService>(INFRATOKENS.IpcSyncService).handle(args[0]));
  }
  /* eslint-enable  @typescript-eslint/no-explicit-any */
  //#endregion


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
