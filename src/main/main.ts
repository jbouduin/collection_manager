import { app, BrowserWindow, net, protocol } from "electron";
import { MigrationProvider } from "kysely";
import "reflect-metadata";
import { setCacheLimit } from "scryfall-sdk";
import { container } from "tsyringe";
import { updateElectronApp } from "update-electron-app";

import MIGRATOKENS from "./database/migrations/migration.tokens";
import { MigrationDi } from "./database/migrations/migrations.di";
import INFRATOKENS, { IImageCacheService, IWindowService } from "./services/infra/interfaces";
import { IDatabaseService } from "./services/infra/interfaces/database.service";
import { IIpcDispatcherService } from "./services/infra/interfaces/ipc-dispatcher.service";
import { ServicesDI } from "./services/services.di";
import SYNCTOKENS, { ICardSetSyncService, ISymbologySyncService } from "./services/sync/interfaces";

// FEATURE Replace scrfall-sdk
setCacheLimit(0);
// check for updates
updateElectronApp();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const bootFunction = async (splashWindow: BrowserWindow) => {
  const migrationContainer = MigrationDi.registerMigrations();
  await container.resolve<IDatabaseService>(INFRATOKENS.DatabaseService)
    .connect("c:/data/new-assistant")
    .migrateToLatest(migrationContainer.resolve<MigrationProvider>(MIGRATOKENS.NewCustomMigrationProvider))
    .then(() => migrationContainer.dispose());
    // TODO this should only be done when new installation
    // .then(() => container.resolve<ICatalogSyncService>(SYNCTOKENS.CatalogSyncService).sync({ catalogs: AllCatalogTypes }))
    // TODO make those things setting dependent
    // .then(() => container.resolve<ICardSetSyncService>(SYNCTOKENS.CardSetSyncService).sync({ code: null }, (label: string) => splashWindow.webContents.send("splash", label)));
    // .then(() => container.resolve<ISymbologySyncService>(SYNCTOKENS.SymbologySyncService).sync(null, (label: string) => splashWindow.webContents.send("splash", label)));
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  ServicesDI.register();
  const cacheService = container.resolve<IImageCacheService>(INFRATOKENS.ImageCacheService);
  protocol.handle("cached-image", (request: Request) => {
    return cacheService.getCachedImage(request.url);
  });

  container.resolve<IIpcDispatcherService>(INFRATOKENS.IpcDispatcherService).Initialize();
  container.resolve<IWindowService>(INFRATOKENS.WindowService).boot(bootFunction);

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

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and import them here.
