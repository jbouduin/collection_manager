import { DialogAction } from "../../../../../../shared/components/base";
import { CollectionTreeViewmodel } from "../../../../../viewmodels";


export interface DialogData {
  dialogAction: DialogAction;
  selectedCollection: CollectionTreeViewmodel;
}
