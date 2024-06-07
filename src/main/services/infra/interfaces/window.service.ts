import { BrowserWindow } from "electron";
import { IConfigurationService } from "./configuration.service";

export interface IWindowService {

  boot(bootFunction: (splashWindow: BrowserWindow) => Promise<void>, configurationService: IConfigurationService): void;
  createSplashWindow(): BrowserWindow;
  createFirstTimeWindow(): BrowserWindow;
  createMainWindow(): BrowserWindow;
}
