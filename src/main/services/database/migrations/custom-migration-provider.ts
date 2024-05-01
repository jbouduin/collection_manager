import { Migration, MigrationProvider } from "kysely";
import { injectable } from "tsyringe";

import { V0_0_1_Migration } from "./v0.0.1.migration";

// TODO inject the migration classes (child di container)

@injectable()
export class CustomMigrationProvider implements MigrationProvider {

  private v0_0_1_Migration: V0_0_1_Migration = new V0_0_1_Migration()

  public getMigrations(): Promise<Record<string, Migration>> {
    const result = {
      "v.0.0.1": { up: this.v0_0_1_Migration.up, Vdown: this.v0_0_1_Migration.down}
    }
    return Promise.resolve(result);
  }

}
