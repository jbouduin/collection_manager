const TOKENS = Object.freeze({
  // Database
  CustomMigrationProvider: Symbol("CustomMigrationProvider"),
  DatabaseService: Symbol("DatabaseService"),
  // IPC
  IpcDispatcherService: Symbol("IpcDispatcherService"),
  IpcQueryService: Symbol("IpcQueryService"),
  IpcSyncService: Symbol("IIpcSyncService"),
  // Repositories
  CardRepository: "CardRepository",
  CardSetRepository: "CardSetRepository",
  CatalogRepository: "CatalogRepository",
  ColorRepository: "ColorRepository",
  LanguageRepository: "LanguageRepository",
  SymbologyRepository: "SymbologyRepository",
  // Sync
  CardSyncService: "CardSyncService",
  CardSetSyncService: "CardSetSyncService",
  CatalogSyncService: "CatalogSyncService",
  SymbologySyncService: "SymbologySyncService"
});

export default TOKENS;
