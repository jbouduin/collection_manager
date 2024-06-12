import { Props } from "@blueprintjs/core";
import { DatabaseViewConfigurationViewmodel } from "../../../viewmodels/configuration/database-view-configuration.viewmodel";

export interface DatabaseViewConfigurationViewProps extends Props {
  configuration: DatabaseViewConfigurationViewmodel;
  onConfigurationChanged: (configuration: DatabaseViewConfigurationViewmodel) => void;
}
