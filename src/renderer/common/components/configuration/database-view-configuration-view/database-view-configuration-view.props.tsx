import { Props } from "@blueprintjs/core";
import { DatabaseViewTreeConfigurationViewmodel } from "../../../viewmodels/configuration/database-view-configuration.viewmodel";

export interface DatabaseViewConfigurationViewProps extends Props {
  configuration: DatabaseViewTreeConfigurationViewmodel;
  onConfigurationChanged: () => void;
}
