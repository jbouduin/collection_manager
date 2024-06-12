import { DtoDatabaseViewConfiguration } from "./database-view-configuration.dto";

export interface DtoRendererConfiguration {
  useDarkTheme: boolean;
  databaseViewConfiguration: DtoDatabaseViewConfiguration;
}
