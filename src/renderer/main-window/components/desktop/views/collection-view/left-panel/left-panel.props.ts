import { Props } from "@blueprintjs/core";
import { CollectionViewmodel } from "../../../../..//viewmodels/collection/collection.viewmodel";

export interface LeftPanelProps extends Props {
  onCollectionSelected: (collections: Array<CollectionViewmodel>) => void;
}
