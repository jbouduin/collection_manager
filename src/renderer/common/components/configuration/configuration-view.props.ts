import { Props } from "@blueprintjs/core";
import { ConfigurationViewModel } from "../../viewmodels/configuration/configuration.viewmodel";

export interface ConfigurationViewProps extends Props {
  configuration: ConfigurationViewModel;
}
