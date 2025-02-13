import { container } from "tsyringe";

import { CardSetSyncService } from "./implementation/card-set-sync.service";
import { CardSyncService } from "./implementation/card-sync.service";
import { CatalogSyncService } from "./implementation/catalog-sync.service";
import { RulingSyncService } from "./implementation/ruling-sync.service";
import { CardSymbolSyncService } from "./implementation/card-symbol-sync.service";
import SYNCTOKENS, { ICardSetSyncService, ICardSyncService, ICatalogSyncService, IRulingSyncService, ICardSymbolSyncService } from "./interface";


export class SyncDi {
  public static registerSynchronizers() {
    container.register<ICardSetSyncService>(SYNCTOKENS.CardSetSyncService, { useClass: CardSetSyncService });
    container.register<ICardSyncService>(SYNCTOKENS.CardSyncService, { useClass: CardSyncService });
    container.register<ICatalogSyncService>(SYNCTOKENS.CatalogSyncService, { useClass: CatalogSyncService });
    container.register<IRulingSyncService>(SYNCTOKENS.RulingSyncService, { useClass: RulingSyncService });
    container.register<ICardSymbolSyncService>(SYNCTOKENS.CardSymbolSyncService, { useClass: CardSymbolSyncService });
  }
}
