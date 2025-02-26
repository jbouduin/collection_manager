import { Props } from "@blueprintjs/core";

import { DataConfigurationViewmodel } from "../../../viewmodels/configuration/data-configuration.viewmodel";

export interface DataConfigurationViewProps extends Props {
  configuration: DataConfigurationViewmodel;
  isFirstUse: boolean;

  onConfigurationChanged: () => void;
}
