import { Props } from "@blueprintjs/core";
import { ConfigurationViewModel } from "../../common/viewmodels/configuration/configuration.viewmodel";

export interface FirstTimeViewProps extends Props {
  configuration: ConfigurationViewModel;
}
