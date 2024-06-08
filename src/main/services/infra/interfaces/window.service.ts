import { BrowserWindow } from "electron";

import { IConfigurationService } from "./configuration.service";

export interface IWindowService {
  readonly mainWindow: BrowserWindow;
  boot(bootFunction: (splashWindow: BrowserWindow) => Promise<void>, configurationService: IConfigurationService): void;
  createMainWindow(): BrowserWindow;
}
