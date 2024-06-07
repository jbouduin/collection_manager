import { app, BrowserWindow, nativeTheme, protocol, session } from "electron";
import * as fs from "fs";
import { homedir } from "os";
import * as path from "path";
import "reflect-metadata";
import { container } from "tsyringe";
import { updateElectronApp } from "update-electron-app";

import { CardImageDto } from "../common/dto";
import { ImageSize } from "../common/enums";
import { bootFunction } from "./boot";
import INFRATOKENS, { IConfigurationService, IImageCacheService, IWindowService } from "./services/infra/interfaces";
import { IIpcDispatcherService } from "./services/infra/interfaces/ipc-dispatcher.service";
import REPOTOKENS, { ICardRepository } from "./services/repo/interfaces";
import { ServicesDI } from "./services/services.di";

// check for updates
updateElectronApp();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // LATER also allow loading when packed, but then we need to find the correct version to load
  const reactDevToolsPath = path.join(process.env.LOCALAPPDATA, "Google", "Chrome", "User Data", "Default", "Extensions", "fmkadmapgofadopljbjfkapdkoienihi", "5.2.0_0");
  if (!app.isPackaged && fs.existsSync(reactDevToolsPath)) {
    await session.defaultSession.loadExtension(reactDevToolsPath);
  }

  ServicesDI.register();
  protocol.handle("cached-image", async (request: Request) => {
    const url = new URL(request.url);
    return container.resolve<ICardRepository>(REPOTOKENS.CardRepository)
      .getCardImageData(url.hostname, Number.parseInt(url.searchParams.get("sequence")), url.searchParams.get("size") as ImageSize)
      .then((data: CardImageDto) => {
        const cacheService = container.resolve<IImageCacheService>(INFRATOKENS.ImageCacheService);
        return cacheService.getCardImage(data);
      });
  });

  container.resolve<IIpcDispatcherService>(INFRATOKENS.IpcDispatcherService).Initialize();
  const configurationService = container.resolve<IConfigurationService>(INFRATOKENS.ConfigurationService);
  nativeTheme.themeSource = "system";
  configurationService.loadConfiguration(app.getAppPath(), homedir(), nativeTheme.shouldUseDarkColors);
  container.resolve<IWindowService>(INFRATOKENS.WindowService).boot(bootFunction, configurationService);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      console.log("passing through on activate");
      container.resolve<IWindowService>(INFRATOKENS.WindowService).createMainWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it"s common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    container.resolve<IWindowService>(INFRATOKENS.WindowService).createMainWindow();
  }
});
