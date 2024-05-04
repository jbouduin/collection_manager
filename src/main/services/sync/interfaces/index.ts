export * from "./card-set-sync.service";
export * from "./card-sync.service";
export * from "./catalog-sync.service";
export * from "./symbology-sync.service";

const SYNCTOKENS = Object.freeze({
  CardSyncService: "CardSyncService",
  CardSetSyncService: "CardSetSyncService",
  CatalogSyncService: "CatalogSyncService",
  SymbologySyncService: "SymbologySyncService"
});

export default SYNCTOKENS;