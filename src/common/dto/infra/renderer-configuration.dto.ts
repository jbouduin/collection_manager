import { DatabaseTreeViewConfigurationDto } from "./database-view-tree-configuration.dto";

export interface RendererConfigurationDto {
  useDarkTheme: boolean;
  logServerResponses: boolean;
  databaseViewTreeConfiguration: DatabaseTreeViewConfigurationDto;
  /*
   * FEATURE settings for all center panels
   * for all views ->
   *  card columns to be displayed
   *  default sort order (possibilities depend on view)
   * for collection -> how to display quantities:
   *   one single column with the total
   *   one single column with total foil and total non-foil
   *   one column for foil, one for non-foil
   *   one column per condition with non-foil and foil
   *   one column per condition per foil/non-foil
   *   display order: foil first or non-foil first
   */
}
