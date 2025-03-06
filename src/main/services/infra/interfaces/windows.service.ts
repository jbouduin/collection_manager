import { BrowserWindow } from "electron";


export interface IWindowsService {
  readonly mainWindow: BrowserWindow;

  createFirstTimeWindow(): BrowserWindow;
  createMainWindow(): BrowserWindow;
  createSplashWindow(): BrowserWindow;
  getDeckWindow(deckId: number): void;
}
