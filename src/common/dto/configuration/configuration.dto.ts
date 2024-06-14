import { DtoSyncParam } from "../sync/sync-param.dto";
import { DtoDataConfiguration } from "./data-configuration.dto";
import { DtoRendererConfiguration } from "./renderer-configuration.dto";
import { DtoScryfallConfiguration } from "./scryfall-configuration.dto";

export interface DtoConfiguration {
  dataConfiguration: DtoDataConfiguration;
  rendererConfiguration: DtoRendererConfiguration;
  scryfallConfiguration: DtoScryfallConfiguration;
  syncAtStartupConfiguration: DtoSyncParam;
}
