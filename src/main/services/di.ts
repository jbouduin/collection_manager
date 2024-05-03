import { MigrationProvider } from "kysely";
import { Lifecycle, container } from "tsyringe";
import { DatabaseService, IDatabaseService } from "./database/database.service";
import { CustomMigrationProvider } from "./database/migrations/custom-migration-provider";
import { CardSetRepository, ICardSetRepository } from "./database/repositories/card-set.repository";
import { CardRepository, ICardRepository } from "./database/repositories/card.repository";
import { CatalogRepository, ICatalogRepository } from "./database/repositories/catalog.repository";
import { ColorRepository, IColorRepository } from "./database/repositories/color-repository";
import { ILanguageRepository, LanguageRepository } from "./database/repositories/language.repository";
import { IIpcDispatcherService, IpcDispatcherService } from "./ipc/ipc-dispatcher.service";
import { IIpcQueryService, IpcQueryService } from "./ipc/ipc-query.service";
import { IIpcSyncService, IpcSyncService } from "./ipc/ipc-sync.service";
import { CardSetSyncService, ICardSetSyncService } from "./sync/card-set-sync.service";
import { CardSyncService, ICardSyncService } from "./sync/card-sync.service";
import { CatalogSyncService, ICatalogSyncService } from "./sync/catalog-sync.service";
import { ISymbologySyncService, SymbologySyncService } from "./sync/symbology-sync.service";
import TOKENS from "./tokens";
import { ISymbologyRepository, SymbologyRepository } from "./database/repositories/symbology.repository";


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
    container.register<ICardSetRepository>(TOKENS.CardSetRepository, { useClass: CardSetRepository }, { lifecycle: Lifecycle.Singleton });
    container.register<ICardRepository>(TOKENS.CardRepository, { useClass: CardRepository }, { lifecycle: Lifecycle.Singleton });
    container.register<ICatalogRepository>(TOKENS.CatalogRepository, { useClass: CatalogRepository }, { lifecycle: Lifecycle.Singleton });
    container.register<IColorRepository>(TOKENS.ColorRepository, { useClass: ColorRepository }, { lifecycle: Lifecycle.Singleton });
    container.register<ILanguageRepository>(TOKENS.LanguageRepository, { useClass: LanguageRepository }, { lifecycle: Lifecycle.Singleton });
    container.register<ISymbologyRepository>(TOKENS.SymbologyRepository, { useClass: SymbologyRepository }, { lifecycle: Lifecycle.Singleton });
    // Sync
    container.register<ICardSetSyncService>(TOKENS.CardSetSyncService, { useClass: CardSetSyncService }, { lifecycle: Lifecycle.Singleton });
    container.register<ICardSyncService>(TOKENS.CardSyncService, { useClass: CardSyncService }, { lifecycle: Lifecycle.Singleton });
    container.register<ICatalogSyncService>(TOKENS.CatalogSyncService, { useClass: CatalogSyncService }, { lifecycle: Lifecycle.Singleton });
    container.register<ISymbologySyncService>(TOKENS.SymbologySyncService, { useClass: SymbologySyncService }, { lifecycle: Lifecycle.Singleton });
  }
}
