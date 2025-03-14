import { ISyncParamDto } from "../sync/sync-param.dto";
import { IDataConfigurationDto } from "./data-configuration.dto";
import { IRendererConfigurationDto } from "./renderer-configuration.dto";
import { IScryfallConfigurationDto } from "./scryfall-configuration.dto";


export interface IConfigurationDto {
  dataConfiguration: IDataConfigurationDto;
  rendererConfiguration: IRendererConfigurationDto;
  // TODO move scryfall at least partially to the database
  scryfallConfiguration: IScryfallConfigurationDto;
  syncAtStartupConfiguration: ISyncParamDto;
  /*
   * TODO deck-picking configuration
   * - condition order
   * - foil/non-foil first
   * - oldest/newst first
   */

  /*
   * TODO system configuration
   * - image size to be used for caching "large" or "small"
   * - dump json files from Scryfall (not to be stored in the database)
   * - renderer debug level
   * - main debug level
   * - database debug level -> maybe not required, as this is debug by default
   * - sync debug level
   */
}
