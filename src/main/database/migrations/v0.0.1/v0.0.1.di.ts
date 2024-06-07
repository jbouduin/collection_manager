import { DependencyContainer, Lifecycle } from "tsyringe";

import { IBaseMigration } from "../base-migration/base.migration";
import MIGRATOKENS from "../migration.tokens";
import { V0_0_1_CardSymbol_Migration } from "./v0.0.1.card-symbol.migration";
import { V0_0_1_Card_Migration } from "./v0.0.1.card.migration";
import { V0_0_1_Catalog_Migration } from "./v0.0.1.catalog.migration";
import { V0_0_1_Color_Migration } from "./v0.0.1.color.migration";
import { V0_0_1_Language_Migration } from "./v0.0.1.language.migration";
import { V0_0_1_Ruling_Migration } from "./v0.0.1.oracle.migration";
import { V0_0_1_Set_Migration } from "./v0.0.1.set.migration";


export class V0_0_1_Di {

  public static registerMigrations(container: DependencyContainer): DependencyContainer {
    container.register<IBaseMigration>(MIGRATOKENS.Migration, { useClass: V0_0_1_Card_Migration }, { lifecycle: Lifecycle.ResolutionScoped });
    container.register<IBaseMigration>(MIGRATOKENS.Migration, { useClass: V0_0_1_Catalog_Migration }, { lifecycle: Lifecycle.ResolutionScoped });
    container.register<IBaseMigration>(MIGRATOKENS.Migration, { useClass: V0_0_1_Color_Migration }, { lifecycle: Lifecycle.ResolutionScoped });
    container.register<IBaseMigration>(MIGRATOKENS.Migration, { useClass: V0_0_1_Language_Migration }, { lifecycle: Lifecycle.ResolutionScoped });
    container.register<IBaseMigration>(MIGRATOKENS.Migration, { useClass: V0_0_1_Ruling_Migration }, { lifecycle: Lifecycle.ResolutionScoped });
    container.register<IBaseMigration>(MIGRATOKENS.Migration, { useClass: V0_0_1_Set_Migration }, { lifecycle: Lifecycle.ResolutionScoped });
    container.register<IBaseMigration>(MIGRATOKENS.Migration, { useClass: V0_0_1_CardSymbol_Migration }, { lifecycle: Lifecycle.ResolutionScoped });
    return container;
  }
}
