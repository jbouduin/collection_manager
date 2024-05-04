import SQLite from "better-sqlite3";
import { existsSync as exists, mkdirSync as mkdir } from "fs";
import { Kysely, MigrationProvider, MigrationResultSet, Migrator, SqliteDialect } from "kysely";
import path from "path";
import { singleton } from "tsyringe";

import { DatabaseSchema } from "../../../database/schema";
import { IDatabaseService } from "../interfaces";

@singleton()
export class DatabaseService implements IDatabaseService {

  private _database: Kysely<DatabaseSchema>;

  public get database(): Kysely<DatabaseSchema> {
    return this._database;
  }

  public connect(dataDirectory: string): IDatabaseService {
    const dbDirectory = path.join(dataDirectory, "database");
    if (!exists(dbDirectory)) {
      mkdir(dbDirectory, { recursive: true });
    }
    const dialect = new SqliteDialect({
      database: new SQLite(path.join(dbDirectory, "magic-db.sqlite"))
    });
    this._database = new Kysely<DatabaseSchema>({ dialect });
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

}
