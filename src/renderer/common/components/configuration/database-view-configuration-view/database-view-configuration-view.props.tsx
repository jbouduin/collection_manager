import { Props } from "@blueprintjs/core";
import { MtgViewTreeConfigurationViewmodel } from "../../../viewmodels";


export interface DatabaseViewConfigurationViewProps extends Props {
  configuration: MtgViewTreeConfigurationViewmodel;
  onConfigurationChanged: () => void;
}
