const TOKENS = Object.freeze({
  // Database
  CustomMigrationProvider: Symbol("CustomMigrationProvider"),
  DatabaseService: Symbol("DatabaseService"),
  // IPC
  IpcDispatcherService: Symbol("IpcDispatcherService"),
  IpcQueryService: Symbol("IpcQueryService"),
  IpcSyncService: Symbol("IIpcSyncService"),
  // Repositories
  CatalogRepository: "CatalogRepository",
  // Sync
  CatalogSyncService: "CatalogSyncService"
})

export default TOKENS
