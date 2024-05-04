import { DependencyContainer, Lifecycle } from "tsyringe";

import { IBaseMigration } from "../base.migration";
import MIGRATOKENS from "../migration.tokens";
import { V0_0_1_Catalog_Migration } from "./v0.0.1.catalog.migration";
import { V0_0_1_Language_Migration } from "./v0.0.1.language.migration";
import { V0_0_1_Set_Migration } from "./v0.0.1.set.migration";
import { V0_0_1_Symbology_Migration } from "./v0.0.1.symbology";

export class V0_0_1_Di {

  public static registerMigrations(container: DependencyContainer): DependencyContainer {
    container.register<IBaseMigration>(MIGRATOKENS.Migration, { useClass: V0_0_1_Catalog_Migration }, { lifecycle: Lifecycle.ResolutionScoped });
    container.register<IBaseMigration>(MIGRATOKENS.Migration, { useClass: V0_0_1_Language_Migration }, { lifecycle: Lifecycle.ResolutionScoped });
    container.register<IBaseMigration>(MIGRATOKENS.Migration, { useClass: V0_0_1_Set_Migration }, { lifecycle: Lifecycle.ResolutionScoped });
    container.register<IBaseMigration>(MIGRATOKENS.Migration, { useClass: V0_0_1_Symbology_Migration }, { lifecycle: Lifecycle.ResolutionScoped });
    return container;
  }
}
