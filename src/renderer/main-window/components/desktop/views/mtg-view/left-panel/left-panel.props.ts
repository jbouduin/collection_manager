import { MtgSetTreeViewConfigurationDto } from "../../../../../../../common/dto";
import { CollectionManagerProps } from "../../../../../../shared/components/base/collection-manager.props";
import { CardSetViewmodel } from "../../../../../viewmodels";


export interface LeftPanelProps extends CollectionManagerProps {
  configuration: MtgSetTreeViewConfigurationDto;
  onSearch: (queryString: string) => void;
  onSetsSelected(sets: Array<CardSetViewmodel>): void;
}
