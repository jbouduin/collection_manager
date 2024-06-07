import { Props } from "@blueprintjs/core";

import { ConfigurationViewModel } from "../../../../common/viewmodels/configuration/configuration.viewmodel";

export interface FooterViewProps extends Props {
  configuration: ConfigurationViewModel;
  onSave: (configuration: ConfigurationViewModel) => void;
  onCancel: () => void;
}
