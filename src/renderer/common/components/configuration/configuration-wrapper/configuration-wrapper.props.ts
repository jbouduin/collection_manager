import { Props } from "@blueprintjs/core";
import { ConfigurationDto } from "../../../../../common/dto";
import { ConfigurationViewModel } from "../../../viewmodels";

export interface ConfigurationWrapperProps extends Props {
  configuration: ConfigurationViewModel;
  onCancel: () => void;
  onSave: (toSave: ConfigurationDto) => void;
}
