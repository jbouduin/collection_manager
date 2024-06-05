import { DtoMainConfiguration } from "./main-configuration.dto";
import { DtoRendererConfiguration } from "./renderer-configuration.dto";

export interface DtoConfiguration {
  mainConfiguration: DtoMainConfiguration;
  rendererConfiguration: DtoRendererConfiguration;
}