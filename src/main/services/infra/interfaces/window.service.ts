import { BrowserWindow } from "electron";

import { IConfigurationService } from "./configuration.service";
import { DtoSyncParam } from "../../../../common/dto";

export interface IWindowService {
  readonly mainWindow: BrowserWindow;
  boot(
    bootFunction: (splashWindow: BrowserWindow, syncParam: DtoSyncParam) => Promise<void>,
    configurationService: IConfigurationService
  ): Promise<void>;
  createMainWindow(): BrowserWindow;
}
