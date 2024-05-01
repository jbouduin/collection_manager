import { ipcMain, nativeTheme } from "electron";
import { inject, singleton } from "tsyringe";
import { EIpcChannel } from "../../../common/enums";
import { IIpcQueryService } from "./ipc-query.service";
import { IIpcSyncService } from "./ipc-sync.service";
import TOKENS from "../tokens";

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

  public Initialize(): void {
    ipcMain.handle(EIpcChannel.darkModeToggle, () => {
      if (nativeTheme.shouldUseDarkColors) {
        nativeTheme.themeSource = 'light';
      } else {
        nativeTheme.themeSource = 'dark';
      }
      return nativeTheme.shouldUseDarkColors
    })

    ipcMain.handle(EIpcChannel.darkModeSystem, () => {
      nativeTheme.themeSource = 'system';
      return nativeTheme.shouldUseDarkColors;
    });

    ipcMain.handle(EIpcChannel.ping, () => 'pong');
    ipcMain.handle(EIpcChannel.query, (_event: Electron.IpcMainEvent, ...args: Array<any>) => this.query.handle(args[0]));
    ipcMain.handle(EIpcChannel.sync, (_event: Electron.IpcMainEvent, ...args: Array<any>) => this.update.handle(args[0]));
  }
}
