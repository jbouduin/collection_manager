
import { Lifecycle, container } from "tsyringe";

import { DatabaseService, IpcDispatcherService, IpcQueryService, IpcSyncService } from "./implementation";
import INFRATOKENS, { IConfigurationService, IDatabaseService, IIpcDispatcherService, IIpcQueryOrSyncService, IIpcQueryService, IIpcSyncService, IWindowService } from "./interfaces";
import { IpcQueryOrSyncService } from "./implementation/ipc-query-or-sync.service";
import { ConfigurationService } from "./implementation/configuration.service";
import { WindowService } from "./implementation/window.service";

export class InfraDi {

  public static registerInfrastructure() {
    container.register<IConfigurationService>(INFRATOKENS.ConfigurationService, { useClass: ConfigurationService }, { lifecycle: Lifecycle.Singleton });
    container.register<IDatabaseService>(INFRATOKENS.DatabaseService, { useClass: DatabaseService }, { lifecycle: Lifecycle.Singleton });
    container.register<IIpcDispatcherService>(INFRATOKENS.IpcDispatcherService, { useClass: IpcDispatcherService }, { lifecycle: Lifecycle.Singleton });
    container.register<IIpcQueryOrSyncService>(INFRATOKENS.IpcQueryOrSyncService, { useClass: IpcQueryOrSyncService }, { lifecycle: Lifecycle.Singleton });
    container.register<IIpcQueryService>(INFRATOKENS.IpcQueryService, { useClass: IpcQueryService }, { lifecycle: Lifecycle.Singleton });
    container.register<IIpcSyncService>(INFRATOKENS.IpcSyncService, { useClass: IpcSyncService }, { lifecycle: Lifecycle.Singleton });
    container.register<IWindowService>(INFRATOKENS.WindowService, { useClass: WindowService }, { lifecycle: Lifecycle.Singleton });
  }
}
