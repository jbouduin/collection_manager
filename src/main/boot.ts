import { BrowserWindow } from "electron";
import { MigrationProvider } from "kysely";
import { container } from "tsyringe";

import MIGRATOKENS from "./database/migrations/migration.tokens";
import { MigrationDi } from "./database/migrations/migrations.di";
import INFRATOKENS, { IDatabaseService } from "./services/infra/interfaces";
import SYNCTOKENS, { ICardSetSyncService, ICardSymbolSyncService, ICatalogSyncService } from "./services/scryfall";


export async function bootFunction(splashWindow: BrowserWindow): Promise<void> {

  const migrationContainer = MigrationDi.registerMigrations();
  await container.resolve<IDatabaseService>(INFRATOKENS.DatabaseService)
    .migrateToLatest(
      migrationContainer.resolve<MigrationProvider>(MIGRATOKENS.NewCustomMigrationProvider),
      (label: string) => splashWindow.webContents.send("splash", label)
    )
    .then((service: IDatabaseService) => service.connect())
    .then(() => migrationContainer.dispose())
    .then(async () => await container.resolve<ICatalogSyncService>(SYNCTOKENS.CatalogSyncService).sync(
      { source: "startup", catalogs: ["AbilityWords", "LandTypes", "ArtifactTypes"] },  // LATER make this allCatalogs when we need them to search
      (label: string) => splashWindow.webContents.send("splash", label))
    )
    .then(async () => await container.resolve<ICardSetSyncService>(SYNCTOKENS.CardSetSyncService).sync(
      { source: "startup", code: null },
      (label: string) => splashWindow.webContents.send("splash", label))
    )
    .then(() => container.resolve<ICardSymbolSyncService>(SYNCTOKENS.CardSymbolSyncService).sync(
      { source: "startup" },
      (label: string) => splashWindow.webContents.send("splash", label))
    )
    .then(() => splashWindow.webContents.send("splash", "loading main program"));

}
