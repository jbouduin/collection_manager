import * as fs from "fs";
import * as path from "path";

import { IConfigurationService } from "../interfaces";

// FEATURE configuration
// cleanup the getters, they should not call fs methods
export class ConfigurationService implements IConfigurationService {

  public get dataDirectory(): string {
    const result = "C:/data/new-assistant";
    if (!fs.existsSync(result)) {
      fs.mkdirSync(result, { recursive: true });
    }
    return result;
  }

  public get dataBaseName(): string {
    return path.join(this.dataDirectory, "database", "magic-db.sqlite");
  }

  public get cacheDirectory(): string {
    const result = path.join(this.dataDirectory, ".cache");
    if (!fs.existsSync(result)) {
      console.log(`creating ${result}`);
      fs.mkdirSync(result, { recursive: true });
    }
    return result;
  }

  public get isNewInstallation(): boolean {
    return !fs.existsSync(this.dataBaseName);
  }
}
