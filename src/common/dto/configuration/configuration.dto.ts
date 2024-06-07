import { DtoMainConfiguration } from "./main-configuration.dto";
import { DtoRendererConfiguration } from "./renderer-configuration.dto";

export interface DtoConfiguration {
  mainConfiguration: DtoMainConfiguration;
  rendererConfiguration: DtoRendererConfiguration;
  // FEATURE backup configuration (target directory, backups to keep, interval)
}
