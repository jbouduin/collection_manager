import { EDesktopView } from "../desktop-view.enum";
import { CollectionManagerProps } from "../../../../shared/components/base/collection-manager.props";
import { IConfigurationDto } from "../../../../../common/dto";


export interface ButtonBarProps extends CollectionManagerProps {
  afterSaveSettings: (saved: IConfigurationDto) => void;
  currentView: EDesktopView;
  onDesktopViewSelectionClick: (desktopView: EDesktopView) => void;
}
