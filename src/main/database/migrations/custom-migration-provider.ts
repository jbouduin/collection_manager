import { Migration, MigrationProvider } from "kysely";
import { injectable } from "tsyringe";

import { V0_0_1_Catalog_Migration } from "./v0.0.1.catalog.migration";
import { V0_0_1_Set_Migration } from "./v0.0.1.set.migration";
import { V0_0_1_Language_Migration } from "./v0.0.1.language.migration";
import { V0_0_1_Symbology_Migration } from "./v0.0.1.symbology";

// TODO inject the migration classes (using child di container)

@injectable()
export class CustomMigrationProvider implements MigrationProvider {


  public getMigrations(): Promise<Record<string, Migration>> {
    const v0_0_1_Catalog_Migration: V0_0_1_Catalog_Migration = new V0_0_1_Catalog_Migration();
    const v0_0_1_Set_Migration: V0_0_1_Set_Migration = new V0_0_1_Set_Migration();
    const v0_0_1_Language_Migration: V0_0_1_Language_Migration = new V0_0_1_Language_Migration();
    const v0_0_1_Symbology_Migration: V0_0_1_Symbology_Migration = new V0_0_1_Symbology_Migration();
    return Promise.resolve({
      "0001: v.0.0.1.Catalog": { up: v0_0_1_Catalog_Migration.up, down: v0_0_1_Catalog_Migration.down },
      "0002: v.0.0.1.Set": { up: v0_0_1_Set_Migration.up, down: v0_0_1_Set_Migration.down },
      "0003: v.0.0.1.Language": { up: v0_0_1_Language_Migration.up, down: v0_0_1_Language_Migration.down },
      "0004: v.0.0.1.Symbology": { up: v0_0_1_Symbology_Migration.up, down: v0_0_1_Symbology_Migration.down },
    });
  }

}
