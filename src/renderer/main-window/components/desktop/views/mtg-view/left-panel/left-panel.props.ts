import { Props } from "@blueprintjs/core";
import { IMtgSetTreeViewConfigurationDto } from "../../../../../../../common/dto";
import { CardSetViewmodel } from "../../../../../viewmodels";


export interface LeftPanelProps extends Props {
  configuration: IMtgSetTreeViewConfigurationDto;
  onSearch: (queryString: string) => void;
  onSetsSelected(sets: Array<CardSetViewmodel>): void;
}
