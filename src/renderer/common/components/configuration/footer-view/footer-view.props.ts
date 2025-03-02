import { Props } from "@blueprintjs/core";
import { ConfigurationViewModel } from "../../../../common/viewmodels";


export interface FooterViewProps extends Props {
  configuration: ConfigurationViewModel;
  onCancel: () => void;
  onSave: (configuration: ConfigurationViewModel) => void;
}
