import { SyncParamDto as SyncParamDto } from "../sync/sync-param.dto";
import { DtoDataConfiguration as DataConfigurationDto } from "./data-configuration.dto";
import { RendererConfigurationDto } from "./renderer-configuration.dto";
import { DtoScryfallConfiguration as ScryfallConfigurationDto } from "./scryfall-configuration.dto";


export interface ConfigurationDto {
  dataConfiguration: DataConfigurationDto;
  rendererConfiguration: RendererConfigurationDto;
  scryfallConfiguration: ScryfallConfigurationDto;
  syncAtStartupConfiguration: SyncParamDto;
}
