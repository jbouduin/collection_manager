
import { Lifecycle, container } from "tsyringe";
import { IRouter } from "../base";
import { INFRASTRUCTURE } from "../service.tokens";
import { BootstrapService } from "./implementation/bootstrap.service";
import { ConfigurationService } from "./implementation/configuration.service";
import { DatabaseService } from "./implementation/database.service";
import { ImageCacheService } from "./implementation/image-cache.service";
import { LogService } from "./implementation/log.service";
import { ResultFactory } from "./implementation/result.factory";
import { RouterService } from "./implementation/router.service";
import { WindowsService } from "./implementation/windows.service";
import { IBootstrapService, IConfigurationService, IDatabaseService, IImageCacheService, IResultFactory, IRouterService, IWindowsService } from "./interfaces";
import { ILogService } from "./interfaces/log.service";
import { ConfigurationRouter, LogRouter } from "./routers";
import { AssetRouter } from "./routers/asset.router";


export class InfraDi {
  public static register() {
    container.register<IBootstrapService>(INFRASTRUCTURE.BootstrapService, { useClass: BootstrapService }, { lifecycle: Lifecycle.Singleton });
    container.register<IConfigurationService>(INFRASTRUCTURE.ConfigurationService, { useClass: ConfigurationService }, { lifecycle: Lifecycle.Singleton });
    container.register<IDatabaseService>(INFRASTRUCTURE.DatabaseService, { useClass: DatabaseService }, { lifecycle: Lifecycle.Singleton });
    container.register<IImageCacheService>(INFRASTRUCTURE.ImageCacheService, { useClass: ImageCacheService });
    container.register<ILogService>(INFRASTRUCTURE.LogService, { useClass: LogService }, { lifecycle: Lifecycle.Singleton });
    container.register<IResultFactory>(INFRASTRUCTURE.ResultFacotry, { useClass: ResultFactory }, { lifecycle: Lifecycle.Singleton });
    container.register<IRouterService>(INFRASTRUCTURE.RouterService, { useClass: RouterService }, { lifecycle: Lifecycle.Singleton });
    container.register<IWindowsService>(INFRASTRUCTURE.WindowsService, { useClass: WindowsService }, { lifecycle: Lifecycle.Singleton });

    container.register<IRouter>(INFRASTRUCTURE.Router, { useClass: AssetRouter }, { lifecycle: Lifecycle.Singleton });
    container.register<IRouter>(INFRASTRUCTURE.Router, { useClass: LogRouter }, { lifecycle: Lifecycle.Singleton });
    container.register<IRouter>(INFRASTRUCTURE.Router, { useClass: ConfigurationRouter }, { lifecycle: Lifecycle.Singleton });
  }
}
