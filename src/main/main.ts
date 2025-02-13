import { app, BrowserWindow, nativeTheme, protocol, session } from "electron";
import * as fs from "fs";
import { homedir } from "os";
import * as path from "path";
import "reflect-metadata";
import { container } from "tsyringe";
import { updateElectronApp } from "update-electron-app";
import { DtoCardImageData } from "../common/dto";
import { CardSide, ImageSize } from "../common/types";
import { bootFunction } from "./boot";
import { IConfigurationService, IImageCacheService, IWindowService } from "./services/infra/interfaces";
import { IIpcDispatcherService } from "./services/infra/interfaces/ipc-dispatcher.service";
import { ICardRepository } from "./services/repo/interfaces";
import { INFRASTRUCTURE, REPOSITORIES } from "./services/service.tokens";
import { ServicesDI } from "./services/services.di";

// check for updates
updateElectronApp();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
/* eslint-disable-next-line @typescript-eslint/no-require-imports */
if (require("electron-squirrel-startup")) {
  app.quit();
}

/*
 * This method will be called when Electron has finished
 * initialization and is ready to create browser windows.
 * Some APIs can only be used after this event occurs.
 */
app.whenReady().then(async () => {
  // LATER also allow loading when packed, but then we need to find the correct version to load
  const reactDevToolsPath = path.join(process.env.LOCALAPPDATA, "Google", "Chrome", "User Data", "Default", "Extensions", "fmkadmapgofadopljbjfkapdkoienihi", "5.2.0_0");
  if (!app.isPackaged && fs.existsSync(reactDevToolsPath)) {
    await session.defaultSession.loadExtension(reactDevToolsPath);
  }

  ServicesDI.register();
  protocol.handle("cached-image", async (request: Request): Promise<Response> => {
    const requestedUrl = new URL(request.url);
    return container.resolve<ICardRepository>(REPOSITORIES.CardRepository)
      .getCardImageData(requestedUrl.hostname)
      .then((data: DtoCardImageData) => {
        data.imageType = requestedUrl.searchParams.get("size") as ImageSize;
        data.side = requestedUrl.searchParams.get("side") as CardSide;
        const cacheService = container.resolve<IImageCacheService>(INFRASTRUCTURE.ImageCacheService);
        return cacheService.getCardImage(data);
      });
  });

  container.resolve<IIpcDispatcherService>(INFRASTRUCTURE.IpcDispatcherService).Initialize();
  const configurationService = container.resolve<IConfigurationService>(INFRASTRUCTURE.ConfigurationService);
  nativeTheme.themeSource = "system";
  configurationService.loadConfiguration(app.getAppPath(), homedir(), nativeTheme.shouldUseDarkColors);
  container.resolve<IWindowService>(INFRASTRUCTURE.WindowService).boot(bootFunction, configurationService);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      // console.log("passing through on activate");
      container.resolve<IWindowService>(INFRASTRUCTURE.WindowService).createMainWindow();
    }
  });
});

/*
 * Quit when all windows are closed, except on macOS. There, it"s common
 * for applications and their menu bar to stay active until the user quits
 * explicitly with Cmd + Q.
 */
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// TODO why do we have this twice
app.on("activate", () => {
  /*
   * On OS X it"s common to re-create a window in the app when the
   * dock icon is clicked and there are no other windows open.
   */
  if (BrowserWindow.getAllWindows().length === 0) {
    container.resolve<IWindowService>(INFRASTRUCTURE.WindowService).createMainWindow();
  }
});
