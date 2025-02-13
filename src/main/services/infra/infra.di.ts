
import { Lifecycle, container } from "tsyringe";

import { ImageCacheService } from "./implementation/image-cache.service";
import { ConfigurationService } from "./implementation/configuration.service";
import { DatabaseService } from "./implementation/database.service";
import { IpcDispatcherService } from "./implementation/ipc-dispatcher.service";
import { IpcQueryService } from "./implementation/ipc-query.service";
import { IpcSyncService } from "./implementation/ipc-sync.service";
import { WindowService } from "./implementation/window.service";
import { IImageCacheService, IConfigurationService, IDatabaseService, IIpcDispatcherService, IIpcQueryService, IIpcSyncService, IWindowService } from "./interfaces";
import { IIpcPostService } from "./interfaces/ipc-post.service";
import { IpcPostService } from "./implementation/ipc-post.service";
import { ILogService } from "./interfaces/log.service";
import { LogService } from "./implementation/log.service";
import { INFRASTRUCTURE } from "../service.tokens";

export class InfraDi {
  public static registerInfrastructure() {
    container.register<IImageCacheService>(INFRASTRUCTURE.ImageCacheService, { useClass: ImageCacheService });
    container.register<IConfigurationService>(INFRASTRUCTURE.ConfigurationService, { useClass: ConfigurationService }, { lifecycle: Lifecycle.Singleton });
    container.register<IDatabaseService>(INFRASTRUCTURE.DatabaseService, { useClass: DatabaseService }, { lifecycle: Lifecycle.Singleton });
    container.register<IIpcDispatcherService>(INFRASTRUCTURE.IpcDispatcherService, { useClass: IpcDispatcherService });
    container.register<IIpcPostService>(INFRASTRUCTURE.IpcPostService, { useClass: IpcPostService });
    container.register<IIpcQueryService>(INFRASTRUCTURE.IpcQueryService, { useClass: IpcQueryService });
    container.register<IIpcSyncService>(INFRASTRUCTURE.IpcSyncService, { useClass: IpcSyncService });
    container.register<IWindowService>(INFRASTRUCTURE.WindowService, { useClass: WindowService }, { lifecycle: Lifecycle.Singleton });

    container.register<ILogService>(INFRASTRUCTURE.LogService, { useClass: LogService }, { lifecycle: Lifecycle.Singleton });
  }
}
