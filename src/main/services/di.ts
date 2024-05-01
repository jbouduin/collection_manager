import { container } from "tsyringe";
import { DatabaseService, IDatabaseService } from "./database/database.service";
import { IIpcDispatcher, IpcDispatcher } from "./ipc-dispatcher";
import { IIpcQueryService, IpcQueryService } from "./ipc/ipc-query.service";
import { IIpcUpdateService, IpcUpdateService } from "./ipc/ipc-update.service";
import TOKENS from "./tokens";
import { MigrationProvider } from "kysely";
import { CustomMigrationProvider } from "./database/migrations/custom-migration-provider";


export class Di {

  public static register() {
    container.register<MigrationProvider>(TOKENS.CustomMigrationProvider, { useClass: CustomMigrationProvider });
    container.register<IDatabaseService>(TOKENS.DatabaseService, { useClass: DatabaseService });
    container.register<IIpcDispatcher>(TOKENS.IpcDispatcher, { useClass: IpcDispatcher });
    container.register<IIpcQueryService>(TOKENS.IpcQueryService, { useClass: IpcQueryService });
    container.register<IIpcUpdateService>(TOKENS.IpcUpdateService, { useClass: IpcUpdateService });
  }
}
