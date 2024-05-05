import { Migration, MigrationProvider } from "kysely";
import { injectAll, injectable } from "tsyringe";

import { IBaseMigration } from "./base.migration";
import MIGRATOKENS from "./migration.tokens";

@injectable()
export class CustomMigrationProvider implements MigrationProvider {

  private allMigrations: Array<IBaseMigration>;

  public constructor(@injectAll(MIGRATOKENS.Migration) allMigrations: Array<IBaseMigration>) {
    this.allMigrations = allMigrations;
  }

  public getMigrations(): Promise<Record<string, Migration>> {
    const result: Record<string, Migration> = {};
    this.allMigrations.forEach((migration: IBaseMigration) => result[migration.keyName] = { up: migration.up, down: migration.down });
    return Promise.resolve(result);
  }
}
