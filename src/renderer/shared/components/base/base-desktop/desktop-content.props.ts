import { Props } from "@blueprintjs/core";
import { IConfigurationDto } from "../../../../../common/dto";


export interface DesktopContentProps extends Props {
  onConfigurationChanged: (newConfiguration: IConfigurationDto) => void;
}
