import { Props } from "@blueprintjs/core";
import { IConfigurationDto } from "../../../../../common/dto";
import { ConfigurationViewModel } from "../../../viewmodels";

export interface ConfigurationWrapperProps extends Props {
  configuration: ConfigurationViewModel;
  onCancel: () => void;
  onSave: (toSave: IConfigurationDto) => void;
}
