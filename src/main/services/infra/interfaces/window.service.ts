import { BrowserWindow } from "electron";

export interface IWindowService {

  boot(bootFunction: (splashWindow: BrowserWindow) => Promise<void>): void;
  createSplashWindow(): BrowserWindow;
  createFirstTimeWindow(): BrowserWindow;
  createMainWindow(): BrowserWindow;
}
