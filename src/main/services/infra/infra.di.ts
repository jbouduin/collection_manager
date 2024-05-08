
import { Lifecycle, container } from "tsyringe";

import { DatabaseService, IpcDispatcherService, IpcQueryService, IpcSyncService } from "./implementation";
import INFRATOKENS, { IDatabaseService, IIpcDispatcherService, IIpcQueryOrSyncService, IIpcQueryService, IIpcSyncService } from "./interfaces";
import { IpcQueryOrSyncService } from "./implementation/ipc-query-or-sync.service";

export class InfraDi {

  public static registerInfrastructure() {
    container.register<IDatabaseService>(INFRATOKENS.DatabaseService, { useClass: DatabaseService }, { lifecycle: Lifecycle.Singleton });
    container.register<IIpcDispatcherService>(INFRATOKENS.IpcDispatcherService, { useClass: IpcDispatcherService }, { lifecycle: Lifecycle.Singleton });
    container.register<IIpcQueryOrSyncService>(INFRATOKENS.IpcQueryOrSyncService, { useClass: IpcQueryOrSyncService }, { lifecycle: Lifecycle.Singleton });
    container.register<IIpcQueryService>(INFRATOKENS.IpcQueryService, { useClass: IpcQueryService }, { lifecycle: Lifecycle.Singleton });
    container.register<IIpcSyncService>(INFRATOKENS.IpcSyncService, { useClass: IpcSyncService }, { lifecycle: Lifecycle.Singleton });
  }
}
