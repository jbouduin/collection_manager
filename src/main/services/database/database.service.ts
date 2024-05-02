import SQLite from 'better-sqlite3';
import { existsSync as exists, mkdirSync as mkdir } from 'fs';
import { Kysely, MigrationProvider, MigrationResultSet, Migrator, SqliteDialect } from 'kysely';
import path from 'path';
import { singleton } from "tsyringe";
import { DatabaseSchema } from "./schema/database.schema";

export interface IDatabaseService {
  readonly database: Kysely<DatabaseSchema>;
  connect(dataDirectory: string): IDatabaseService;
  migrateToLatest(migrationProvider: MigrationProvider): Promise<IDatabaseService>;
}

@singleton()
export class DatabaseService implements IDatabaseService {

  constructor() {
    console.log("database service constructor")
  }

  private _database: Kysely<DatabaseSchema>;

  public get database(): Kysely<DatabaseSchema> {
    console.log('in getter', this._database)
    return this._database;
  }

  public connect(dataDirectory: string): IDatabaseService {
    console.log(dataDirectory)
    let dbDirectory = path.join(dataDirectory, "database")
    if (!exists(dbDirectory)) {
      console.log('have to create it');
      let result = mkdir(dbDirectory, { recursive: true });
      console.log('created', result);
    }
    const dialect = new SqliteDialect({
      database: new SQLite(path.join(dbDirectory, "magic-db.sqlite"))
    });
    this._database = new Kysely<DatabaseSchema>({ dialect });
    return this;
  }

  public async migrateToLatest(migrationProvider: MigrationProvider): Promise<IDatabaseService> {
    const migrationPath = path.join(__dirname, './migrations');
    console.log(migrationPath);
    let migrator = new Migrator({
      db: this._database,
      provider: migrationProvider
    });
    await migrator.migrateToLatest().then((result: MigrationResultSet) => { console.log(result) });
    return Promise.resolve(this);
  }

}
