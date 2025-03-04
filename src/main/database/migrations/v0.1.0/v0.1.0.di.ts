import { DependencyContainer, Lifecycle } from "tsyringe";
import { IBaseMigration } from "../base-migration";

import { V0_1_0_Collection } from "./v0.1.0.collection";
import { V0_1_0_OwnedCards } from "./v0.1.0.owned-card";
import { DATABASE } from "../../../services/service.tokens";
import { V0_1_0_Deck } from "./v0.1.0.deck";

export class V0_1_0_Di {
  public static registerMigrations(container: DependencyContainer): DependencyContainer {
    container.register<IBaseMigration>(DATABASE.Migration, { useClass: V0_1_0_Collection }, { lifecycle: Lifecycle.ResolutionScoped });
    container.register<IBaseMigration>(DATABASE.Migration, { useClass: V0_1_0_OwnedCards }, { lifecycle: Lifecycle.ResolutionScoped });
    container.register<IBaseMigration>(DATABASE.Migration, { useClass: V0_1_0_Deck }, { lifecycle: Lifecycle.ResolutionScoped });
    return container;
  }
}
