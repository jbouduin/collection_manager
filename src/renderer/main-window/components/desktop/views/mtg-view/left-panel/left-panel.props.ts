import { Props } from "@blueprintjs/core";
import { DatabaseTreeViewConfigurationDto } from "../../../../../../../common/dto";
import { CardSetViewmodel } from "../../../../../viewmodels";


export interface LeftPanelProps extends Props {
  configuration: DatabaseTreeViewConfigurationDto;
  onSetsSelected(sets: Array<CardSetViewmodel>): void;
  onSynchronizeSet: (setCode: string) => void;
}
