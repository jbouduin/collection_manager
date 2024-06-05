import { BrowserWindow, app } from "electron";
import { injectable } from "tsyringe";
import { IConfigurationService, IWindowService } from "../interfaces";

// This allows TypeScript to pick up the magic constants that"s auto-generated by Forge"s Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you"re running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
declare const FIRST_TIME_WEBPACK_ENTRY: string;
declare const SPLASH_WINDOW_WEBPACK_ENTRY: string;
declare const SPLASH_WINDOW_PRELOAD_WEBPACK_ENTRY: string;


@injectable()
export class WindowService implements IWindowService {

  public createSplashWindow(): BrowserWindow {
    const splashWindow = new BrowserWindow({
      height: 506,
      width: 900,
      webPreferences: {
        preload: SPLASH_WINDOW_PRELOAD_WEBPACK_ENTRY,
      },
      show: false,
      alwaysOnTop: true,
      frame: false,
    });
    splashWindow.loadURL(SPLASH_WINDOW_WEBPACK_ENTRY);
    return splashWindow;
  }

  public createFirstTimeWindow(): BrowserWindow {
    const createFirstTimeWindow = new BrowserWindow({
      height: 320,
      width: 800,
      show: true,
      alwaysOnTop: true,
      frame: true
    });
    createFirstTimeWindow.loadURL(FIRST_TIME_WEBPACK_ENTRY);
    return createFirstTimeWindow;
  }

  public createMainWindow(): BrowserWindow {
    const mainWindow = new BrowserWindow({
      height: 600,
      width: 800,
      // TODO icon: "/resources/icons/collection_manager_512",
      webPreferences: {
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      },
      show: false
    });
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    if (!app.isPackaged) {
      mainWindow.webContents.openDevTools({ mode: "undocked" });
    }
    return mainWindow;
  }

  public async boot(bootFunction: (splashWindow: BrowserWindow) => Promise<void>, configurationService: IConfigurationService): Promise<void> {
    let mainWindow: BrowserWindow;
    const splashWindow = this.createSplashWindow();

    splashWindow.on("show", async () => {
      await bootFunction(splashWindow).then(
        () => {
          mainWindow = this.createMainWindow();
          mainWindow.on("ready-to-show", () => {
            mainWindow.show();
            if (!splashWindow.isDestroyed()) {
              splashWindow.close();
            }
          });
        },
        () => {
          // TODO show error dialog
          if (!splashWindow.isDestroyed) {
            splashWindow.close();
          }
        }
      );
    });

    splashWindow.on("ready-to-show", () => {
      if (configurationService.isFirstUsage) {
        const firsTimeWindow = this.createFirstTimeWindow();
        firsTimeWindow.on("closed", () => splashWindow.show());
      } else {
        splashWindow.show();
      }
    });
  }
}
