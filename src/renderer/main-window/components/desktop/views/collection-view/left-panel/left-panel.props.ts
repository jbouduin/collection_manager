import { Props } from "@blueprintjs/core";
import { CollectionTreeViewmodel } from "../../../../../viewmodels";

export interface LeftPanelProps extends Props {
  onCollectionSelected: (collections: Array<CollectionTreeViewmodel>) => void;
}
