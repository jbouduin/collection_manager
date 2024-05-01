import { MigrationProvider } from "kysely";
import { Lifecycle, container } from "tsyringe";
import { DatabaseService, IDatabaseService } from "./database/database.service";
import { CustomMigrationProvider } from "./database/migrations/custom-migration-provider";
import { CatalogRepository, ICatalogRepository } from "./database/repositories/catalog.repository";
import { IIpcDispatcherService, IpcDispatcherService } from "./ipc/ipc-dispatcher.service";
import { IIpcQueryService, IpcQueryService } from "./ipc/ipc-query.service";
import { IIpcSyncService, IpcSyncService } from "./ipc/ipc-sync.service";
import TOKENS from "./tokens";
import { CatalogSyncService, ICatalogSyncService } from "./sync/catalog-sync.service";


export class Di {

  public static register() {
    // Database
    container.register<MigrationProvider>(TOKENS.CustomMigrationProvider, { useClass: CustomMigrationProvider }, { lifecycle: Lifecycle.Singleton });
    container.register<IDatabaseService>(TOKENS.DatabaseService, { useClass: DatabaseService }, { lifecycle: Lifecycle.Singleton });
    // IPC
    container.register<IIpcDispatcherService>(TOKENS.IpcDispatcherService, { useClass: IpcDispatcherService },{ lifecycle: Lifecycle.Singleton });
    container.register<IIpcQueryService>(TOKENS.IpcQueryService, { useClass: IpcQueryService }, { lifecycle: Lifecycle.Singleton });
    container.register<IIpcSyncService>(TOKENS.IpcSyncService, { useClass: IpcSyncService }, { lifecycle: Lifecycle.Singleton });
    // Repositories
    container.register<ICatalogRepository>(TOKENS.CatalogRepository, { useClass: CatalogRepository }, { lifecycle: Lifecycle.Singleton });
    // Sync
    container.register<ICatalogSyncService>(TOKENS.CatalogSyncService, { useClass: CatalogSyncService }, { lifecycle: Lifecycle.Singleton });
  }
}
