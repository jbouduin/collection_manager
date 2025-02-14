import { Kysely, MigrationProvider } from "kysely";
import { DatabaseSchema } from "../../../database/schema";
import { ProgressCallback } from "../../../../common/ipc";

export interface IDatabaseService {
  readonly database: Kysely<DatabaseSchema>;
  connect(): IDatabaseService;
  migrateToLatest(migrationProvider: MigrationProvider, progressCallback: ProgressCallback): Promise<IDatabaseService>;
}
