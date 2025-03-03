import { MtgSetTreeViewConfigurationDto } from "../../../../../../../../common/dto";
import { CollectionManagerProps } from "../../../../../../../common/collection-manager.props";
import { CardSetViewmodel } from "../../../../../../viewmodels";
import { CardSetTreeViewmodel } from "../../../../../../viewmodels/card-set/card-set-tree.viewmodel";


export interface LeftPanelProps extends CollectionManagerProps {
  cardSets: Array<CardSetTreeViewmodel>;
  configuration: MtgSetTreeViewConfigurationDto;
  onSetsSelected: (sets: Array<CardSetViewmodel>) => void;
}
