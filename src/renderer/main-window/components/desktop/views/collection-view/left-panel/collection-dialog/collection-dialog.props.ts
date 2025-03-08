import { Props } from "@blueprintjs/core";
import { DialogAction } from "../../../../../../../shared/components/base";
import { CollectionTreeViewmodel } from "../../../../../../viewmodels";


export interface CollectionDialogProps extends Props {
  collection?: CollectionTreeViewmodel;
  collectionSvg: string;
  dialogAction: DialogAction;
  isOpen: boolean;
  onCancel: () => void;
  onSave: (collection: CollectionTreeViewmodel) => void;
}
