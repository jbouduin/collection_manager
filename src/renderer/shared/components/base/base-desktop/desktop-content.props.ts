import { ConfigurationDto } from "../../../../../common/dto";
import { CollectionManagerProps } from "../collection-manager.props";

export interface DesktopContentProps extends CollectionManagerProps {
  onConfigurationChanged: (newConfiguration: ConfigurationDto) => void;
}
