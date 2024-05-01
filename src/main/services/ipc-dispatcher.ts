import { ipcMain, nativeTheme } from "electron";
import { inject, singleton } from "tsyringe";
import { EIpcChannel } from "../../common";
import { IIpcQueryService } from "./ipc/ipc-query.service";
import { IIpcUpdateService } from "./ipc/ipc-update.service";
import TOKENS from "./tokens";

export interface IIpcDispatcher {
  Initialize(): void
}

@singleton()
export class IpcDispatcher implements IIpcDispatcher{

  private query: IIpcQueryService;
  private update: IIpcUpdateService;

  public constructor(
    @inject(TOKENS.IpcQueryService) query: IIpcQueryService,
    @inject(TOKENS.IpcUpdateService) update: IIpcUpdateService)
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
    ipcMain.handle(EIpcChannel.update, (_event: Electron.IpcMainEvent, ...args: Array<any>) => this.update.handle(args[0]));
  }
}
