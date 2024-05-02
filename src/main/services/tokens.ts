const TOKENS = Object.freeze({
  // Database
  CustomMigrationProvider: Symbol("CustomMigrationProvider"),
  DatabaseService: Symbol("DatabaseService"),
  // IPC
  IpcDispatcherService: Symbol("IpcDispatcherService"),
  IpcQueryService: Symbol("IpcQueryService"),
  IpcSyncService: Symbol("IIpcSyncService"),
  // Repositories
  CardSetRepository: "CardSetRepository",
  CatalogRepository: "CatalogRepository",
  // Sync
  CardSetSyncService: "CardSetSyncService",
  CatalogSyncService: "CatalogSyncService"
})

export default TOKENS
