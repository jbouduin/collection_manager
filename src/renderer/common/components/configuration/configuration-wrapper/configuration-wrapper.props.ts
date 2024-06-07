import { Props } from "@blueprintjs/core";

import { ConfigurationViewModel } from "../../../viewmodels/configuration/configuration.viewmodel";

export interface ConfigurationWrapperProps extends Props {
  configuration: ConfigurationViewModel;
  onCancel: () => void;
  onSave: () => void;
}
