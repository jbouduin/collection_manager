import { Props } from "@blueprintjs/core";
import { IMtgSetTreeViewConfigurationDto } from "../../../../../../../../common/dto";
import { CardSetTreeViewmodel } from "../../../../../../viewmodels";


export interface LeftPanelProps extends Props {
  cardSets: Array<CardSetTreeViewmodel>;
  configuration: IMtgSetTreeViewConfigurationDto;
  onSetsSelected: (sets: Array<CardSetTreeViewmodel>) => void;
}
