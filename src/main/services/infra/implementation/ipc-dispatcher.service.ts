import { ipcMain, nativeTheme } from "electron";
import { container, inject, singleton } from "tsyringe";
import { DarkmodeOption } from "../../../../common/ipc-params";
import { INFRASTRUCTURE } from "../../service.tokens";
import { IIpcDispatcherService, IIpcSyncService, IWindowsService } from "../interfaces";
import { IIpcPostService } from "../interfaces/ipc-post.service";


@singleton()
export class IpcDispatcherService implements IIpcDispatcherService{

  private readonly windowService: IWindowsService;

  public constructor(@inject(INFRASTRUCTURE.WindowsService) windowService: IWindowsService) {
    this.windowService = windowService;
  }

  //#region IIpcDispatcherService methods -------------------------------------
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  public Initialize(): IIpcDispatcherService {
    ipcMain.handle("darkmode", (_event: Electron.IpcMainEvent, ...args: Array<any>) => this.handleDarkMode(args[0]));
    ipcMain.handle("sync", (_event: Electron.IpcMainEvent, ...args: Array<any>) => container.resolve<IIpcSyncService>(INFRASTRUCTURE.IpcSyncService).handle(args[0], this.windowService.mainWindow));
    ipcMain.handle("post", (_event: Electron.IpcMainEvent, ...args: Array<any>) => container.resolve<IIpcPostService>(INFRASTRUCTURE.IpcPostService).handle(args[0]));
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
