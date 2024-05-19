export * from "./card-set-sync.service";
export * from "./card-symbol-sync.service";
export * from "./card-sync.service";
export * from "./catalog-sync.service";
export * from "./ruling-sync.service";

const SYNCTOKENS = Object.freeze({
  CardSyncService: "CardSyncService",
  CardSetSyncService: "CardSetSyncService",
  CardSymbolSyncService: "CardSymbolSyncService",
  CatalogSyncService: "CatalogSyncService",
  RulingSyncService: "RulingSyncService"
});

export default SYNCTOKENS;
