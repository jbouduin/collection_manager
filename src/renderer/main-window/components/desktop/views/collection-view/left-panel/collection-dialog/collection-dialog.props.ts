import { Props } from "@blueprintjs/core";
import { CollectionTreeViewmodel } from "../../../../../../viewmodels";
import { DialogAction } from "../dialog-action";


export interface CollectionDialogProps extends Props {
  collection?: CollectionTreeViewmodel;
  dialogAction: DialogAction;
  isOpen: boolean;
  onCancel: () => void;
  onSave: (collection: CollectionTreeViewmodel) => void;
}
