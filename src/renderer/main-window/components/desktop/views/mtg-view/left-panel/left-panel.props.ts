import { Props } from "@blueprintjs/core";
import { IMtgSetTreeViewConfigurationDto } from "../../../../../../../common/dto";
import { CardSetTreeViewmodel } from "../../../../../viewmodels";


export interface LeftPanelProps extends Props {
  configuration: IMtgSetTreeViewConfigurationDto;
  onSearch: (queryString: string) => void;
  onSetsSelected(sets: Array<CardSetTreeViewmodel>): void;
}
