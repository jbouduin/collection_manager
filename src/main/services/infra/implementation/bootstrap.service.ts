import { app, BrowserWindow, dialog, ipcMain, IpcMainEvent, nativeTheme, session } from "electron";
import { existsSync } from "fs";
import { join } from "path";
import { container, injectable } from "tsyringe";
import { IBootstrapService, IRouterService, IConfigurationService, IWindowsService, IDatabaseService, IIpcSyncService } from "../interfaces";
import { IRouter } from "../../base";
import { homedir } from "os";
import { IpcChannel, IpcRequest } from "../../../../common/ipc";
import { MigrationDi } from "../../../database/migrations/migrations.di";
import { MigrationProvider } from "kysely";
import { INFRASTRUCTURE, DATABASE } from "../../service.tokens";
import { SyncParamDto } from "../../../../common/dto";


@injectable()
export class BootstrapService implements IBootstrapService {
  //#region IBootstrapService methods -----------------------------------------
  public async boot(
    windowsService: IWindowsService,
    rootRouterService: IRouterService,
    routers: Array<IRouter>,
    settingsService: IConfigurationService
  ): Promise<void> {
    await this.preboot(settingsService, rootRouterService, routers);
    const splashWindow = windowsService.createSplashWindow();
    splashWindow.on("show", () => {
      void this.bootFunction(splashWindow)
        .then(() => {
          windowsService.createMainWindow();
          windowsService.mainWindow.on("ready-to-show", () => {
            windowsService.mainWindow.show();
            if (!splashWindow.isDestroyed()) {
              splashWindow.close();
            }
          });
        })
        .catch((reason: Error) => {
          splashWindow.hide();
          dialog.showErrorBox(`Error:" ${reason.message}`, reason.stack);
          app.exit();
        });
    });

    void splashWindow.on("ready-to-show", () => {
      if (settingsService.isFirstUsage) {
        const firsTimeWindow = windowsService.createFirstTimeWindow();
        firsTimeWindow.on("closed", () => {
          if (settingsService.isFirstUsage) {
            app.quit();
          } else {
            splashWindow.show();
          }
        });
      } else {
        splashWindow.show();
      }
    });
    return Promise.resolve();
  }
  //#endregion

  //#region helper methods ----------------------------------------------------
  private async preboot(
    configurationService: IConfigurationService,
    routerService: IRouterService,
    routers: Array<IRouter>
  ): Promise<void> {
    const reactDevToolsPath = join(process.env.LOCALAPPDATA, "Google", "Chrome", "User Data", "Default", "Extensions", "fmkadmapgofadopljbjfkapdkoienihi", "5.2.0_0");
    if (!app.isPackaged && existsSync(reactDevToolsPath)) {
      await session.defaultSession.loadExtension(reactDevToolsPath);
    }
    configurationService.loadSettings(app.getAppPath(), homedir(), nativeTheme.shouldUseDarkColors);
    routers.forEach((svc: IRouter) => svc.setRoutes(routerService));
    routerService.logRoutes();
    this.registerIpcChannel("DELETE", routerService);
    this.registerIpcChannel("GET", routerService);
    this.registerIpcChannel("PATCH", routerService);
    this.registerIpcChannel("POST", routerService);
    this.registerIpcChannel("PUT", routerService);
    return Promise.resolve();
  }

  private async bootFunction(splashWindow: BrowserWindow): Promise<void> {
    splashWindow.webContents.send("splash", "Initializing");
    const migrationContainer = MigrationDi.registerMigrations();
    await container.resolve<IDatabaseService>(INFRASTRUCTURE.DatabaseService)
      .migrateToLatest(
        migrationContainer.resolve<MigrationProvider>(DATABASE.CustomMigrationProvider),
        (label: string) => splashWindow.webContents.send("splash", label)
      )
      .then((service: IDatabaseService) => service.connect())
      .then(() => migrationContainer.dispose())
      .then(() => {
        const configurationService = container.resolve<IConfigurationService>(INFRASTRUCTURE.ConfigurationService);
        const syncParam = configurationService.isFirstUsage
          ? this.firstUseSyncParam()
          : configurationService.configuration.syncAtStartupConfiguration;
        return container
          .resolve<IIpcSyncService>(INFRASTRUCTURE.IpcSyncService)
          .handle(syncParam, splashWindow);
      })
      .then(() => splashWindow.webContents.send("splash", "loading main program"));
  }

  private registerIpcChannel(channel: IpcChannel, routerService: IRouterService) {
    ipcMain.handle(
      channel,
      (_event: IpcMainEvent, ...args: Array<unknown>) => routerService.routeRequest(channel, _event.sender, args[0] as IpcRequest<unknown>)
    );
  }

  private firstUseSyncParam(): SyncParamDto {
    const result: SyncParamDto = {
      catalogTypesToSync: ["AbilityWords", "LandTypes", "ArtifactTypes"], // add more catalogs when we need them to search
      syncCardSymbols: true,
      syncCardSets: true,
      rulingSyncType: "none",
      cardSyncType: "none",
      cardSelectionToSync: [],
      cardImageStatusToSync: [],
      syncCardsSyncedBeforeNumber: 0,
      syncCardsSyncedBeforeUnit: undefined,
      cardSetCodeToSyncCardsFor: undefined,
      changedImageStatusAction: undefined
    };
    return result;
  }
}
