import { container } from "tsyringe";

import { CardSetSyncService } from "./implementation/card-set-sync.service";
import { CardSyncService } from "./implementation/card-sync.service";
import { CatalogSyncService } from "./implementation/catalog-sync.service";
import { RulingSyncService } from "./implementation/ruling-sync.service";
import { CardSymbolSyncService } from "./implementation/card-symbol-sync.service";
import { ICardSetSyncService, ICardSyncService, ICatalogSyncService, IRulingSyncService, ICardSymbolSyncService } from "./interface";
import { SCRYFALL } from "../../service.tokens";


export class SyncDi {
  public static registerSynchronizers() {
    container.register<ICardSetSyncService>(SCRYFALL.CardSetSyncService, { useClass: CardSetSyncService });
    container.register<ICardSyncService>(SCRYFALL.CardSyncService, { useClass: CardSyncService });
    container.register<ICatalogSyncService>(SCRYFALL.CatalogSyncService, { useClass: CatalogSyncService });
    container.register<IRulingSyncService>(SCRYFALL.RulingSyncService, { useClass: RulingSyncService });
    container.register<ICardSymbolSyncService>(SCRYFALL.CardSymbolSyncService, { useClass: CardSymbolSyncService });
  }
}
