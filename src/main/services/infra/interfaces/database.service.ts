import { Kysely, MigrationProvider } from "kysely";
import { DatabaseSchema } from "../../../database/schema";

export interface IDatabaseService {
  readonly database: Kysely<DatabaseSchema>;
  connect(dataDirectory: string): IDatabaseService;
  migrateToLatest(migrationProvider: MigrationProvider): Promise<IDatabaseService>;
}
