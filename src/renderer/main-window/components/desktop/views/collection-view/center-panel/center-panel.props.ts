import { Props } from "@blueprintjs/core";
import { CollectionCardListViewmodel } from "../../../../../viewmodels";
import { CollectionTreeViewmodel } from "../../../../../viewmodels";


export interface CenterPanelProps extends Props {
  selectedCollection: CollectionTreeViewmodel;
  onCardsSelected(cards?: Array<CollectionCardListViewmodel>): void;
}
