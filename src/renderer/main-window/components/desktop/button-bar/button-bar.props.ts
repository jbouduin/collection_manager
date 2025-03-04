import { EDesktopView } from "../desktop-view.enum";
import { CollectionManagerProps } from "../../../../shared/collection-manager.props";
import { ConfigurationDto } from "../../../../../common/dto";


export interface ButtonBarProps extends CollectionManagerProps {
  afterSaveSettings: (saved: ConfigurationDto) => void;
  currentView: EDesktopView;
  onDesktopViewSelectionClick: (desktopView: EDesktopView) => void;
}
