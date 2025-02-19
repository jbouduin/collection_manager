export const INFRASTRUCTURE = Object.freeze({
  BootstrapService: "BootstrapService",
  ConfigurationService: "ConfigurationService",
  DatabaseService: "DatabaseService",
  ImageCacheService: "ImageCacheService",
  LogService: "LogService",
  ResultFacotry: "ResultFactory",
  RouterService: "RouterService",
  Router: "Router",
  WindowsService: "WindowsService"
});

export const DATABASE = Object.freeze({
  CustomMigrationProvider: Symbol("CustomMigrationProvider"),
  Migration: Symbol("Migration")
});

export const REPOSITORIES = Object.freeze({
  CardConditionRepository: "CardConditionRepository",
  CardRepository: "CardRepository",
  CardSetRepository: "CardSetRepository",
  CardSymbolRepository: "CardSymbolRepository",
  CatalogRepository: "CatalogRepository",
  CollectionRepository: "CollectionRepository",
  ColorRepository: "ColorRepository",
  LanguageRepository: "LanguageRepository",
  OracleRepository: "OracleRepository"
});

export const MTG = Object.freeze({
  SyncService: "SyncService"
});

export const SCRYFALL = Object.freeze({
  // Client
  ScryfallClient: "ScryfallClient",
  // Synchronizers
  CardSyncService: "CardSyncService",
  CardSetSyncService: "CardSetSyncService",
  CardSymbolSyncService: "CardSymbolSyncService",
  CatalogSyncService: "CatalogSyncService",
  RulingSyncService: "RulingSyncService",
  // Adapters
  CardSetAdapter: "CardSetAdapter",
  CatalogAdapter: "CatalogAdapter",
  CardSymbolAdapter: "CardSymbolAdapter",
  CardSymbolAlternativeAdapter: "CardSymbolAlternativeAdapter",
  CardSymbolColorMapAdapter: "CardSymbolColorMapAdapter",
  CardAdapter: "CardAdapter",
  CardColorMapAdapter: "CardColorMapAdapter",
  CardGameAdapter: "CardGameAdapter",
  CardMultiverseIdAdapter: "CardMultiverseIdAdapter",
  CardfaceAdapter: "CardfaceAdapter",
  CardfaceColorMapAdapter: "CardfaceColorMapAdapter",
  CardCardMapAdapter: "CardCardMapAdapter",
  OracleAdapter: "OracleAdapter",
  OracleKeywordAdapter: "OracleKeywordAdapter",
  OracleLegalityAdapter: "OracleLegalityAdapter",
  OracleRulingLineAdapter: "OracleRulingLineAdapter",
  OracleRulingAdapter: "OracleRulingAdapter"
});
