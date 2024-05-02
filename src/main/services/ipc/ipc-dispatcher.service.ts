import { ipcMain, nativeTheme } from "electron";
import { inject, singleton } from "tsyringe";
import { EIpcChannel } from "../../../common/enums";
import { DarkmodeOption } from "../../../common/ipc-params/darkmode.option";
import TOKENS from "../tokens";
import { IIpcQueryService } from "./ipc-query.service";
import { IIpcSyncService } from "./ipc-sync.service";

export interface IIpcDispatcherService {
  Initialize(): void
}

@singleton()
export class IpcDispatcherService implements IIpcDispatcherService{

  private query: IIpcQueryService;
  private update: IIpcSyncService;

  public constructor(
    @inject(TOKENS.IpcQueryService) query: IIpcQueryService,
    @inject(TOKENS.IpcSyncService) update: IIpcSyncService)
  {
    this.query = query;
    this.update = update;
  }

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  public Initialize(): void {
    ipcMain.handle(EIpcChannel.darkmode, (_event: Electron.IpcMainEvent, ...args: Array<any>) => this.handelDarkMode(args[0]));
    ipcMain.handle(EIpcChannel.ping, () => "pong");
    ipcMain.handle(EIpcChannel.query, (_event: Electron.IpcMainEvent, ...args: Array<any>) => this.query.handle(args[0]));
    ipcMain.handle(EIpcChannel.sync, (_event: Electron.IpcMainEvent, ...args: Array<any>) => this.update.handle(args[0]));
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
