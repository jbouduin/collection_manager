import { Props } from "@blueprintjs/core";
import { IMtgSetTreeViewConfigurationDto } from "../../../../../../../../common/dto";
import { CardSetTreeViewmodel, CardSetViewmodel } from "../../../../../../viewmodels";


export interface LeftPanelProps extends Props {
  cardSets: Array<CardSetTreeViewmodel>;
  configuration: IMtgSetTreeViewConfigurationDto;
  onSetsSelected: (sets: Array<CardSetViewmodel>) => void;
}
