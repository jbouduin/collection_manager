import { EDesktopView } from "../desktop-view.enum";
import { CollectionManagerProps } from "../../../../shared/components/base/collection-manager.props";
import { ConfigurationDto } from "../../../../../common/dto";


export interface ButtonBarProps extends CollectionManagerProps {
  afterSaveSettings: (saved: ConfigurationDto) => void;
  currentView: EDesktopView;
  onDesktopViewSelectionClick: (desktopView: EDesktopView) => void;
}
