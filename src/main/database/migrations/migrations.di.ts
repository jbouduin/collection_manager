import { MigrationProvider } from "kysely";
import { DependencyContainer, Lifecycle, container } from "tsyringe";

import { CustomMigrationProvider } from "./custom-migration-provider";
import { DATABASE } from "../../services/service.tokens";
import { V1_0_0_Di } from "./v1.0.0/v1.0.0.di";

export class MigrationDi {
  public static registerMigrations(): DependencyContainer {
    const child = container.createChildContainer();
    child.register<MigrationProvider>(DATABASE.CustomMigrationProvider, { useClass: CustomMigrationProvider }, { lifecycle: Lifecycle.Singleton });
    V1_0_0_Di.registerMigrations(child);
    return child;
  }
}
