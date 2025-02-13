import { Kysely, Migration, MigrationProvider } from "kysely";
import { injectAll, injectable } from "tsyringe";
import { IBaseMigration } from "./base-migration/base.migration";
import { DATABASE } from "../../services/service.tokens";


@injectable()
export class CustomMigrationProvider implements MigrationProvider {
  //#region private readonly fields -------------------------------------------
  private readonly allMigrations: Array<IBaseMigration>;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(@injectAll(DATABASE.Migration) allMigrations: Array<IBaseMigration>) {
    this.allMigrations = allMigrations;
  }
  //#endregion

  //#region MigrationProvider implementation ----------------------------------
  public getMigrations(): Promise<Record<string, Migration>> {
    const result: Record<string, Migration> = {};
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    this.allMigrations.forEach((migration: IBaseMigration) => result[migration.keyName] = { up: (db: Kysely<any>) => migration.up(db), down: (db: Kysely<any>) => migration.down(db) });
    return Promise.resolve(result);
  }
  //#endregion
}
