import { DatabaseTreeViewConfigurationDto } from "../../../../../../../../common/dto";
import { CollectionManagerProps } from "../../../../../../../common/collection-manager.props";
import { CardSetViewmodel } from "../../../../../../viewmodels";


export interface LeftPanelProps extends CollectionManagerProps {
  configuration: DatabaseTreeViewConfigurationDto;
  onSetsSelected: (sets: Array<CardSetViewmodel>) => void;
}
