import { BrowserWindow, app } from "electron";
import { injectable } from "tsyringe";
import { IWindowsService } from "../interfaces";

/*
 * This allows TypeScript to pick up the magic constants that"s auto-generated by Forge"s Webpack
 * plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
 * whether you"re running in development or production).
 */
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
declare const FIRST_TIME_WEBPACK_ENTRY: string;
declare const FIRST_TIME_PRELOAD_WEBPACK_ENTRY: string;
declare const SPLASH_WINDOW_WEBPACK_ENTRY: string;
declare const SPLASH_WINDOW_PRELOAD_WEBPACK_ENTRY: string;


@injectable()
export class WindowsService implements IWindowsService {
  //#region private fields ----------------------------------------------------
  private _mainWindow: BrowserWindow;
  //#endregion

  //#region IRouteDestinationService properties -------------------------------
  public get mainWindow(): BrowserWindow {
    return this._mainWindow;
  }
  //#endregion

  //#region IWindowsService methods -------------------------------------------
  public createFirstTimeWindow(): BrowserWindow {
    const createFirstTimeWindow = new BrowserWindow({
      height: 320,
      width: 800,
      webPreferences: {
        preload: FIRST_TIME_PRELOAD_WEBPACK_ENTRY
      },
      icon: "assets/icons/logo.ico",
      show: true,
      alwaysOnTop: true,
      frame: true
    });
    void createFirstTimeWindow.loadURL(FIRST_TIME_WEBPACK_ENTRY);
    return createFirstTimeWindow;
  }

  public createMainWindow(): BrowserWindow {
    this._mainWindow = new BrowserWindow({
      height: 600,
      width: 800,
      icon: "assets/icons/logo.ico",
      webPreferences: {
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
      },
      show: false
    });

    void this._mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    if (!app.isPackaged) {
      this._mainWindow.webContents.openDevTools({ mode: "undocked" });
    }
    return this._mainWindow;
  }

  public createSplashWindow(): BrowserWindow {
    const splashWindow = new BrowserWindow({
      height: 506,
      width: 900,
      webPreferences: {
        preload: SPLASH_WINDOW_PRELOAD_WEBPACK_ENTRY
      },
      show: false,
      alwaysOnTop: true,
      frame: false
    });
    void splashWindow.loadURL(SPLASH_WINDOW_WEBPACK_ENTRY);
    return splashWindow;
  }
  //#endregion
}
