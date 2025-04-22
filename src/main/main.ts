import { app, BrowserWindow, ipcMain, session } from "electron";
import { existsSync } from "fs";
import { join } from "path";
import "reflect-metadata";
import { container } from "tsyringe";
import { updateElectronApp } from "update-electron-app/dist";
import { INFRASTRUCTURE } from "./services/service.tokens";
import { ServicesDI } from "./services/services.di";
import { IBootstrapService, IWindowsService } from "./services/infra/interfaces";


// check for updates
updateElectronApp();

/*
 * Handle creating/removing shortcuts on Windows when installing/uninstalling.
 */

/* eslint-disable-next-line @typescript-eslint/no-require-imports */
if (require("electron-squirrel-startup")) {
  app.quit();
}

/*
 * This method will be called when Electron has finished
 * initialization and is ready to create browser windows.
 * Some APIs can only be used after this event occurs.
 */
void app.whenReady().then(async () => {
  ServicesDI.register();
  await container
    .resolve<IBootstrapService>(INFRASTRUCTURE.BootstrapService)
    .boot();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      container.resolve<IWindowsService>(INFRASTRUCTURE.WindowsService).createMainWindow();
    }
  });

  /*
   * this used to be const reactDevToolsPath = join(process.env.LOCALAPPDATA, "Google", "Chrome", "User Data", "Default", "Extensions", "fmkadmapgofadopljbjfkapdkoienihi", "5.2.0_0");
   * after putting latest build -> loading failed because electron can not handle V3 manifest
   * so as a hack: downloaded an old version of the dev tools and use that one
   */
  const reactDevToolsPath = join(process.env.LOCALAPPDATA, "Google", "Chrome", "User Data", "Default", "Extensions", "react-dev-tools-hack");
  if (!app.isPackaged && existsSync(reactDevToolsPath)) {
    await session.defaultSession.loadExtension(reactDevToolsPath);
  }
});

ipcMain.handle("ping", (_event: Electron.IpcMainEvent, ..._args: Array<unknown>) => Promise.resolve("pong"));

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
