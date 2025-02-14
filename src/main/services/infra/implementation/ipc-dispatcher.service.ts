import { ipcMain } from "electron";
import { container, inject, singleton } from "tsyringe";
import { INFRASTRUCTURE } from "../../service.tokens";
import { IIpcDispatcherService, IIpcSyncService, IWindowsService } from "../interfaces";


@singleton()
export class IpcDispatcherService implements IIpcDispatcherService{
  private readonly windowService: IWindowsService;

  public constructor(@inject(INFRASTRUCTURE.WindowsService) windowService: IWindowsService) {
    this.windowService = windowService;
  }

  //#region IIpcDispatcherService methods -------------------------------------
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  public Initialize(): IIpcDispatcherService {
    ipcMain.handle("sync", (_event: Electron.IpcMainEvent, ...args: Array<any>) => container.resolve<IIpcSyncService>(INFRASTRUCTURE.IpcSyncService).handle(args[0], this.windowService.mainWindow));
    return this;
  }
  /* eslint-enable  @typescript-eslint/no-explicit-any */
  //#endregion


}
