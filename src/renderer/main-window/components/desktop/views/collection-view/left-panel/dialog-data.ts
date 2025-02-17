import { CollectionTreeViewmodel } from "../../../../../viewmodels/collection/collection.viewmodel";
import { DialogAction } from "./dialog-action";

export interface DialogData {
  selectedCollection: CollectionTreeViewmodel;
  dialogAction: DialogAction;
}
