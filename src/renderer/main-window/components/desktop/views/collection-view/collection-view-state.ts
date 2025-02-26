import { CollectionCardListViewmodel, CollectionTreeViewmodel } from "../../../../viewmodels";

export interface CollectionViewState {
  selectedCollection?: CollectionTreeViewmodel;
  selectedCards?: Array<CollectionCardListViewmodel>;
}
