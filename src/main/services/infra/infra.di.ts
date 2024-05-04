import { MigrationProvider } from "kysely";
import { Lifecycle, container } from "tsyringe";
// import { CustomMigrationProvider } from "../../../main/database/migrations/custom-migration-provider";
import { DatabaseService, IpcDispatcherService, IpcQueryService, IpcSyncService } from "./implementation";
import INFRATOKENS, { IDatabaseService, IIpcDispatcherService, IIpcQueryService, IIpcSyncService } from "./interfaces";

export class InfraDi {

  public static registerInfrastructure() {
    // Database
    // container.register<MigrationProvider>(INFRATOKENS.CustomMigrationProvider, { useClass: CustomMigrationProvider }, { lifecycle: Lifecycle.Singleton });
    container.register<IDatabaseService>(INFRATOKENS.DatabaseService, { useClass: DatabaseService }, { lifecycle: Lifecycle.Singleton });
    // IPC
    container.register<IIpcDispatcherService>(INFRATOKENS.IpcDispatcherService, { useClass: IpcDispatcherService },{ lifecycle: Lifecycle.Singleton });
    container.register<IIpcQueryService>(INFRATOKENS.IpcQueryService, { useClass: IpcQueryService }, { lifecycle: Lifecycle.Singleton });
    container.register<IIpcSyncService>(INFRATOKENS.IpcSyncService, { useClass: IpcSyncService }, { lifecycle: Lifecycle.Singleton });
  }
}
