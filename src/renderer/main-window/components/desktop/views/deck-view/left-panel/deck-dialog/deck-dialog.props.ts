import { Props } from "@blueprintjs/core";
import { DialogAction } from "../../../../../../../shared/components";
import { DeckViewmodel } from "../../../../../../viewmodels";


export interface DeckDialogProps extends Props {
  deck?: DeckViewmodel;
  deckSvg: string;
  dialogAction: DialogAction;
  isOpen: boolean;
  onCancel: () => void;
  onSave: (collection: DeckViewmodel) => void;
}
