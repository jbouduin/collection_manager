import { Props } from "@blueprintjs/core";
import { CollectionViewmodel } from "../../../../../../viewmodels/collection/collection.viewmodel";
import { DialogAction } from "../dialog-action";

export interface CollectionDialogProps extends Props {
  collection?: CollectionViewmodel;
  dialogAction: DialogAction;
  isOpen: boolean;

  onCancel: () => void;
  onSave: (collection: CollectionViewmodel) => void;
}
