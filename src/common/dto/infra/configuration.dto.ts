import { SyncParamDto as SyncParamDto } from "../sync/sync-param.dto";
import { DtoDataConfiguration as DataConfigurationDto } from "./data-configuration.dto";
import { RendererConfigurationDto } from "./renderer-configuration.dto";
import { DtoScryfallConfiguration as ScryfallConfigurationDto } from "./scryfall-configuration.dto";


export interface ConfigurationDto {
  dataConfiguration: DataConfigurationDto;
  rendererConfiguration: RendererConfigurationDto;
  // to be moved to the database
  scryfallConfiguration: ScryfallConfigurationDto;
  syncAtStartupConfiguration: SyncParamDto;
  /*
   * TODO deck-picking configuration
   * - condition order
   * - foil/non-foil first
   * - oldest/newst first
   */

  /*
   * TODO system configuration
   * - dump json files from Scryfall (not to be stored in the database)
   * - renderer debug level
   * - main debug level
   */
}
