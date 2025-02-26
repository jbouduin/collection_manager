import { Props } from "@blueprintjs/core";

import { ConfigurationViewModel } from "../../../viewmodels/configuration/configuration.viewmodel";
import { ConfigurationDto } from "../../../../../common/dto";

export interface ConfigurationWrapperProps extends Props {
  configuration: ConfigurationViewModel;
  onCancel: () => void;
  onSave: (toSave: ConfigurationDto) => void;
}
