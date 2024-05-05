
import { Lifecycle, container } from "tsyringe";

import { DatabaseService, IpcDispatcherService, IpcQueryService, IpcSyncService } from "./implementation";
import INFRATOKENS, { IDatabaseService, IIpcDispatcherService, IIpcQueryService, IIpcSyncService } from "./interfaces";

export class InfraDi {

  public static registerInfrastructure() {
    container.register<IDatabaseService>(INFRATOKENS.DatabaseService, { useClass: DatabaseService }, { lifecycle: Lifecycle.Singleton });
    container.register<IIpcDispatcherService>(INFRATOKENS.IpcDispatcherService, { useClass: IpcDispatcherService },{ lifecycle: Lifecycle.Singleton });
    container.register<IIpcQueryService>(INFRATOKENS.IpcQueryService, { useClass: IpcQueryService }, { lifecycle: Lifecycle.Singleton });
    container.register<IIpcSyncService>(INFRATOKENS.IpcSyncService, { useClass: IpcSyncService }, { lifecycle: Lifecycle.Singleton });
  }
}
