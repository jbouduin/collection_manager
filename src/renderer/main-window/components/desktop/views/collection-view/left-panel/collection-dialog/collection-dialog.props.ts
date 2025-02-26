import { Props } from "@blueprintjs/core";
import { CollectionTreeViewmodel } from "../../../../../../viewmodels/collection/collection.viewmodel";
import { DialogAction } from "../dialog-action";


export interface CollectionDialogProps extends Props {
  collection?: CollectionTreeViewmodel;
  dialogAction: DialogAction;
  isOpen: boolean;

  onCancel: () => void;
  onSave: (collection: CollectionTreeViewmodel) => void;
}
