import { Kysely, KyselyPlugin, MigrationProvider } from "kysely";
import { DatabaseSchema } from "../../../database/schema";

export interface IDatabaseService {
  readonly database: Kysely<DatabaseSchema>;
  connect(): IDatabaseService;
  migrateToLatest(plugin: KyselyPlugin, migrationProvider: MigrationProvider): Promise<IDatabaseService>;
}
