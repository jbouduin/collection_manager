import { Props } from "@blueprintjs/core";
import { ConfigurationViewModel } from "../../../viewmodels";


export interface ConfigurationViewProps extends Props {
  configuration: ConfigurationViewModel;
  configurationChanged: (changed: ConfigurationViewModel) => void;
}
