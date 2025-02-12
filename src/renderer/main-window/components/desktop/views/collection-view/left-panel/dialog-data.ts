import { CollectionViewmodel } from "../../../../../viewmodels/collection/collection.viewmodel";
import { DialogAction } from "./dialog-action";

export interface DialogData  {
  selectedCollection: CollectionViewmodel;
  previousSelectedCollection: CollectionViewmodel;
  dialogIsOpen: boolean;
  dialogAction: DialogAction;
}
