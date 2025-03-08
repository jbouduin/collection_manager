import { DialogAction } from "../../../../../../shared/components/base";
import { DeckViewmodel } from "../../../../../viewmodels";


export interface DialogData {
  dialogAction: DialogAction;
  selectedDeck: DeckViewmodel;
}
