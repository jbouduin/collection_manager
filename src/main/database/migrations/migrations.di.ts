import { MigrationProvider } from "kysely";
import { DependencyContainer, Lifecycle, container } from "tsyringe";

import { CustomMigrationProvider } from "./custom-migration-provider";
import MIGRATOKENS from "./migration.tokens";
import { V0_0_1_Di } from "./v0.0.1/v0.0.1.di";
import { V0_1_0_Di } from "./v0.1.0/v0.1.0.di";

export class MigrationDi {

  public static registerMigrations(): DependencyContainer {
    const child = container.createChildContainer();
    child.register<MigrationProvider>(MIGRATOKENS.NewCustomMigrationProvider, { useClass: CustomMigrationProvider }, { lifecycle: Lifecycle.Singleton });
    V0_0_1_Di.registerMigrations(child);
    V0_1_0_Di.registerMigrations(child);
    return child;
  }

}
