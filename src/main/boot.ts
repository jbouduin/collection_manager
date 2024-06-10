import { BrowserWindow } from "electron";
import { MigrationProvider } from "kysely";
import { container } from "tsyringe";

import MIGRATOKENS from "./database/migrations/migration.tokens";
import { MigrationDi } from "./database/migrations/migrations.di";
import INFRATOKENS, { IDatabaseService, IIpcSyncService } from "./services/infra/interfaces";
import { DtoSyncParam } from "../common/dto";


export async function bootFunction(splashWindow: BrowserWindow, syncParam: DtoSyncParam): Promise<void> {

  const migrationContainer = MigrationDi.registerMigrations();
  await container.resolve<IDatabaseService>(INFRATOKENS.DatabaseService)
    .migrateToLatest(
      migrationContainer.resolve<MigrationProvider>(MIGRATOKENS.NewCustomMigrationProvider),
      (label: string) => splashWindow.webContents.send("splash", label)
    )
    .then((service: IDatabaseService) => service.connect())
    .then(() => migrationContainer.dispose())
    .then(async () => await container
      .resolve<IIpcSyncService>(INFRATOKENS.IpcSyncService)
      .handle(syncParam, splashWindow)
    )
    .then(() => splashWindow.webContents.send("splash", "loading main program"));

}
