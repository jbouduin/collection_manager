import { ISyncParamDto } from "../sync/sync-param.dto";
import { IDataConfigurationDto } from "./data-configuration.dto";
import { IRendererConfigurationDto } from "./renderer-configuration.dto";
import { IScryfallConfigurationDto } from "./scryfall-configuration.dto";


export interface IConfigurationDto {
  dataConfiguration: IDataConfigurationDto;
  rendererConfiguration: IRendererConfigurationDto;
  // to be moved to the database
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
   * - dump json files from Scryfall (not to be stored in the database)
   * - renderer debug level
   * - main debug level
   */
}
