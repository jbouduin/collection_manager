import { app, BrowserWindow, dialog, ipcMain, IpcMainEvent, nativeTheme, protocol } from "electron";
import { MigrationProvider } from "kysely";
import { homedir } from "os";
import { container, injectable } from "tsyringe";
import { IMtgCardImageDataDto, ISyncParamDto } from "../../../../common/dto";
import { IpcChannel, IpcRequest } from "../../../../common/ipc";
import { CardSide, CatalogType, ECatalogType, ImageSize } from "../../../../common/types";
import { MigrationDi } from "../../../database/migrations/migrations.di";
import { ICardRepository } from "../../../database/repo/interfaces";
import { IResult, IRouter } from "../../base";
import { IMtgSyncService } from "../../mtg/interfaces";
import { DATABASE, INFRASTRUCTURE, MTG, REPOSITORIES } from "../../service.tokens";
import { IBootstrapService, IConfigurationService, IDatabaseService, IImageCacheService, IRouterService, IWindowsService } from "../interfaces";


@injectable()
export class BootstrapService implements IBootstrapService {
  //#region IBootstrapService methods -----------------------------------------
  public async boot(): Promise<void> {
    const windowsService: IWindowsService = container.resolve(INFRASTRUCTURE.WindowsService);
    const rootRouterService: IRouterService = container.resolve(INFRASTRUCTURE.RouterService);
    const settingsService: IConfigurationService = container.resolve(INFRASTRUCTURE.ConfigurationService);

    await this.preboot(settingsService, rootRouterService);
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
  private async preboot(configurationService: IConfigurationService, routerService: IRouterService): Promise<void> {
    configurationService.loadSettings(app.getAppPath(), homedir(), nativeTheme.shouldUseDarkColors);
    container.resolveAll(INFRASTRUCTURE.Router).forEach((svc: IRouter) => svc.setRoutes(routerService));
    routerService.logRoutes();
    this.registerIpcChannel("DELETE", routerService);
    this.registerIpcChannel("GET", routerService);
    this.registerIpcChannel("PATCH", routerService);
    this.registerIpcChannel("POST", routerService);
    this.registerIpcChannel("PUT", routerService);
    protocol.handle("cached-image", async (request: Request): Promise<Response> => {
      const requestedUrl = new URL(request.url);
      return container.resolve<ICardRepository>(REPOSITORIES.CardRepository)
        .getCardImageData(requestedUrl.hostname)
        .then((data: IResult<IMtgCardImageDataDto>) => {
          data.data.imageType = requestedUrl.searchParams.get("size") as ImageSize;
          data.data.side = requestedUrl.searchParams.get("side") as CardSide;
          const cacheService = container.resolve<IImageCacheService>(INFRASTRUCTURE.ImageCacheService);
          return cacheService.getCardImage(data.data);
        });
    });

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
          .resolve<IMtgSyncService>(MTG.SyncService)
          .synchronize(syncParam, splashWindow.webContents);
      })
      .then(() => splashWindow.webContents.send("splash", "loading main program"));
  }

  private registerIpcChannel(channel: IpcChannel, routerService: IRouterService) {
    ipcMain.handle(
      channel,
      (_event: IpcMainEvent, ...args: Array<unknown>) => routerService.routeRequest(channel, _event.sender, args[0] as IpcRequest<unknown>)
    );
  }

  private firstUseSyncParam(): ISyncParamDto {
    const result: ISyncParamDto = {
      cardImageStatusToSync: [],
      bulkSyncUrl: undefined,
      cardSelectionToSync: [],
      cardSetCodeToSyncCardsFor: undefined,
      cardSyncType: "none",
      catalogTypesToSync: Object.keys(ECatalogType) as Array<CatalogType>,
      changedImageStatusAction: undefined,
      oracleId: undefined,
      rulingSyncType: "none",
      syncCardSymbols: true,
      syncCardSets: true,
      syncCardsSyncedBeforeNumber: 0,
      syncCardsSyncedBeforeUnit: undefined
    };
    return result;
  }
}
