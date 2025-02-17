import { Props } from "@blueprintjs/core";
import { CardViewmodel } from "../../../../../viewmodels";
import { CollectionTreeViewmodel } from "../../../../../viewmodels";


export interface CenterPanelProps extends Props {
  selectedCollection: CollectionTreeViewmodel;
  onCardsSelected(cards?: Array<CardViewmodel>): void;
}
