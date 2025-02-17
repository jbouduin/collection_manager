import { CardSetViewmodel, CardViewmodel, CollectionTreeViewmodel } from "../../../../viewmodels";

export interface CollectionViewState {
  selectedCollection?: CollectionTreeViewmodel;
  selectedCards?: Array<CardViewmodel>;
}
