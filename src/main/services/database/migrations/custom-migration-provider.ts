import { Migration, MigrationProvider } from "kysely";
import { injectable } from "tsyringe";
import { v0_0_1_down, v0_0_1_up } from "./v0.0.1";

@injectable()
export class CustomMigrationProvider implements MigrationProvider {

  getMigrations(): Promise<Record<string, Migration>> {
    const result = {
      "v.0.0.1": { up: v0_0_1_up, down: v0_0_1_down}
    }
    return Promise.resolve(result);
  }

}
