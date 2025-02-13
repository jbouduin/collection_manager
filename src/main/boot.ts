import { BrowserWindow } from "electron";
import { MigrationProvider } from "kysely";
import { container } from "tsyringe";
import { MigrationDi } from "./database/migrations/migrations.di";
import { IDatabaseService, IIpcSyncService } from "./services/infra/interfaces";
import { SyncParamDto } from "../common/dto";
import { INFRASTRUCTURE, DATABASE } from "./services/service.tokens";


export async function bootFunction(splashWindow: BrowserWindow, syncParam: SyncParamDto): Promise<void> {
  const migrationContainer = MigrationDi.registerMigrations();
  await container.resolve<IDatabaseService>(INFRASTRUCTURE.DatabaseService)
    .migrateToLatest(
      migrationContainer.resolve<MigrationProvider>(DATABASE.CustomMigrationProvider),
      (label: string) => splashWindow.webContents.send("splash", label)
    )
    .then((service: IDatabaseService) => service.connect())
    .then(() => migrationContainer.dispose())
    .then(async () => await container
      .resolve<IIpcSyncService>(INFRASTRUCTURE.IpcSyncService)
      .handle(syncParam, splashWindow))
    .then(() => splashWindow.webContents.send("splash", "loading main program"));
}
