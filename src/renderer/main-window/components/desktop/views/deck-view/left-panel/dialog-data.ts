import { DialogAction } from "../../../../../../shared/components";
import { DeckViewmodel } from "../../../../../viewmodels";


export interface DialogData {
  dialogAction: DialogAction;
  selectedDeck: DeckViewmodel;
}
