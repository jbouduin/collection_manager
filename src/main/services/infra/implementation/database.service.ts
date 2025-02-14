import SQLite from "better-sqlite3";
import { Kysely, MigrationInfo, MigrationProvider, MigrationResultSet, Migrator, ParseJSONResultsPlugin, SqliteDialect } from "kysely";
import { inject, singleton } from "tsyringe";
import { ProgressCallback } from "../../../../common/ipc-params";
import { DatabaseSchema } from "../../../database/schema";
import { INFRASTRUCTURE } from "../../service.tokens";
import { IConfigurationService, IDatabaseService } from "../interfaces";
import { runSerial } from "../util";
import { SqliteKyselyPlugin } from "./sqlite.kysely.plugin";


@singleton()
export class DatabaseService implements IDatabaseService {
  //#region private fields ----------------------------------------------------
  private _database: Kysely<DatabaseSchema>;
  private configurationService: IConfigurationService;
  //#endregion

  //#region IDatabaseService properties ---------------------------------------
  public get database(): Kysely<DatabaseSchema> {
    return this._database;
  }
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(@inject(INFRASTRUCTURE.ConfigurationService) configurationService: IConfigurationService) {
    this.configurationService = configurationService;
  }
  //#endregion

  //#region IDatabaseService methods ------------------------------------------
  public connect(): IDatabaseService {
    console.log("connecting to", this.configurationService.dataBaseFilePath);
    const dialect = new SqliteDialect({
      database: new SQLite(this.configurationService.dataBaseFilePath)
    });
    this._database = new Kysely<DatabaseSchema>({
      dialect: dialect,
      plugins: [new ParseJSONResultsPlugin(), new SqliteKyselyPlugin()]
    });
    return this;
  }

  public async migrateToLatest(migrationProvider: MigrationProvider, progressCallback: ProgressCallback): Promise<IDatabaseService> {
    const dialect = new SqliteDialect({
      database: new SQLite(this.configurationService.dataBaseFilePath)
    });
    const connection = new Kysely<DatabaseSchema>({
      dialect: dialect
    });

    const migrator = new Migrator({ db: connection, provider: migrationProvider });

    const migrationsToExecute = (await migrator.getMigrations()).filter((migration: MigrationInfo) => !migration.executedAt);

    return runSerial<MigrationInfo>(
      migrationsToExecute,
      async (mig: MigrationInfo, index: number, total: number) => {
        progressCallback(`Performing Migration ${mig.name} (${index + 1}/${total})`);
        await migrator.migrateTo(mig.name)
          .then((migrationResultSet: MigrationResultSet) => {
            if (migrationResultSet.error) {
              throw migrationResultSet.error;
            }
          });
      }
    )
      .then(() => this);
  }
  //#endregion
}
