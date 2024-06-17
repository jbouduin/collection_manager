import { DependencyContainer, Lifecycle } from "tsyringe";

import { IBaseMigration } from "../base-migration";
import MIGRATOKENS from "../migration.tokens";
import { V0_1_0_Collection } from "./v0.1.0.collection";
import { V0_1_0_OwnedCards } from "./v0.1.0.owned-card";

export class V0_1_0_Di {

  public static registerMigrations(container: DependencyContainer): DependencyContainer {
    container.register<IBaseMigration>(MIGRATOKENS.Migration, { useClass: V0_1_0_Collection }, { lifecycle: Lifecycle.ResolutionScoped });
    container.register<IBaseMigration>(MIGRATOKENS.Migration, { useClass: V0_1_0_OwnedCards }, { lifecycle: Lifecycle.ResolutionScoped });
    return container;
  }
}
