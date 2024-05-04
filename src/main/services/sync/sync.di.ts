import { Lifecycle, container } from "tsyringe";
import { CardSetSyncService } from "./implementation/card-set-sync.service";
import { CardSyncService } from "./implementation/card-sync.service";
import { CatalogSyncService } from "./implementation/catalog-sync.service";
import { SymbologySyncService } from "./implementation/symbology-sync.service";
import SYNCTOKENS, { ICardSetSyncService, ICardSyncService, ICatalogSyncService, ISymbologySyncService } from "./interfaces";


export class SyncDi {

  public static registerSynchronizers() {
    // Sync
    container.register<ICardSetSyncService>(SYNCTOKENS.CardSetSyncService, { useClass: CardSetSyncService }, { lifecycle: Lifecycle.Singleton });
    container.register<ICardSyncService>(SYNCTOKENS.CardSyncService, { useClass: CardSyncService }, { lifecycle: Lifecycle.Singleton });
    container.register<ICatalogSyncService>(SYNCTOKENS.CatalogSyncService, { useClass: CatalogSyncService }, { lifecycle: Lifecycle.Singleton });
    container.register<ISymbologySyncService>(SYNCTOKENS.SymbologySyncService, { useClass: SymbologySyncService }, { lifecycle: Lifecycle.Singleton });
  }
}
