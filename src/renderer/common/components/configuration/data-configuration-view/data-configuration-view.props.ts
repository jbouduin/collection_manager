import { Props } from "@blueprintjs/core";
import { DataConfigurationViewmodel } from "../../../viewmodels";

export interface DataConfigurationViewProps extends Props {
  configuration: DataConfigurationViewmodel;
  isFirstUse: boolean;
  onConfigurationChanged: () => void;
}
