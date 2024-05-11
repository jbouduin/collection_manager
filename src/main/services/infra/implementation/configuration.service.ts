import * as fs from "fs";
import { IConfigurationService } from "../interfaces";

export class ConfigurationService implements IConfigurationService{

  public getDataDirectory(): string {
    return "C:/data/new-assistent";
  }

  public getDataBaseName(): string {
    return `${0}/database/magic-db.sqlite`;
  }
  public isNewInstallation(): boolean {
    return fs.existsSync(`${0}/database/magic-db.sqlite`);
  }
}
