import SQLite from "better-sqlite3";
import { Kysely, MigrationProvider, MigrationResultSet, Migrator, ParseJSONResultsPlugin, SqliteDialect } from "kysely";
import { inject, singleton } from "tsyringe";

import { DatabaseSchema } from "../../../database/schema";
import INFRATOKENS, { IConfigurationService, IDatabaseService } from "../interfaces";
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
  public constructor(@inject(INFRATOKENS.ConfigurationService) configurationService: IConfigurationService) {
    this.configurationService = configurationService;
  }
  //#endregion

  //#region IDatabaseService methods ------------------------------------------
  public connect(): IDatabaseService {

    const dialect = new SqliteDialect({
      database: new SQLite(this.configurationService.dataBaseFilePath)
    });
    this._database = new Kysely<DatabaseSchema>({
      dialect: dialect,
      plugins: [new ParseJSONResultsPlugin(), new SqliteKyselyPlugin()]
    });
    return this;
  }

  public async migrateToLatest(migrationProvider: MigrationProvider): Promise<IDatabaseService> {
    await new Migrator(
      {
        db: this._database,
        provider: migrationProvider
      })
      .migrateToLatest()
      .then((result: MigrationResultSet) => { console.log("Migration result: ", result); });
    return Promise.resolve(this);
  }
  //#endregion
}
