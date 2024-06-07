import { DtoMainConfiguration } from "./main-configuration.dto";
import { DtoRendererConfiguration } from "./renderer-configuration.dto";
import { DtoScryfallConfiguration } from "./scryfall-configuration.dto";

export interface DtoConfiguration {
  mainConfiguration: DtoMainConfiguration;
  rendererConfiguration: DtoRendererConfiguration;
  scryfallConfiguration: DtoScryfallConfiguration;
  // FEATURE backup configuration (target directory, backups to keep, interval)
}
