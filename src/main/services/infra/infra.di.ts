
import { Lifecycle, container } from "tsyringe";

import { ImageCacheService } from "./implementation/image-cache.service";
import { ConfigurationService } from "./implementation/configuration.service";
import { DatabaseService } from "./implementation/database.service";
import { IpcDispatcherService } from "./implementation/ipc-dispatcher.service";
import { IpcQueryService } from "./implementation/ipc-query.service";
import { IpcSyncService } from "./implementation/ipc-sync.service";
import { WindowService } from "./implementation/window.service";
import INFRATOKENS, { IImageCacheService, IConfigurationService, IDatabaseService, IIpcDispatcherService, IIpcQueryService, IIpcSyncService, IWindowService } from "./interfaces";
import { IIpcPostService } from "./interfaces/ipc-post.service";
import { IpcPostService } from "./implementation/ipc-post.service";

export class InfraDi {
  public static registerInfrastructure() {
    container.register<IImageCacheService>(INFRATOKENS.ImageCacheService, { useClass: ImageCacheService });
    container.register<IConfigurationService>(INFRATOKENS.ConfigurationService, { useClass: ConfigurationService }, { lifecycle: Lifecycle.Singleton });
    container.register<IDatabaseService>(INFRATOKENS.DatabaseService, { useClass: DatabaseService }, {lifecycle: Lifecycle.Singleton});
    container.register<IIpcDispatcherService>(INFRATOKENS.IpcDispatcherService, { useClass: IpcDispatcherService });
    container.register<IIpcPostService>(INFRATOKENS.IpcPostService, { useClass: IpcPostService });
    container.register<IIpcQueryService>(INFRATOKENS.IpcQueryService, { useClass: IpcQueryService });
    container.register<IIpcSyncService>(INFRATOKENS.IpcSyncService, { useClass: IpcSyncService });
    container.register<IWindowService>(INFRATOKENS.WindowService, { useClass: WindowService }, { lifecycle: Lifecycle.Singleton });
  }
}
