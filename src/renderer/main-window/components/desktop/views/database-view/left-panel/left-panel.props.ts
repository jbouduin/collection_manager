import { Props } from "@blueprintjs/core";

import { DtoDatabaseTreeViewConfiguration } from "../../../../../../../common/dto";
import { CardSetViewmodel } from "../../../../../viewmodels";

export interface LeftPanelProps extends Props {
  configuration: DtoDatabaseTreeViewConfiguration;
  onSetsSelected(sets: Array<CardSetViewmodel>): void;
  onSynchronizeSet: (setCode: string) => void;
  onCardSetDialog: (cardSet: CardSetViewmodel) => void;
}
