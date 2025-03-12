import { Props } from "@blueprintjs/core";
import { IOwnedCardQuantityDto } from "../../../../common/dto";


export interface OwnedCardDialogProps extends Props {
  cardId: string;
  onClose(quantities: Array<IOwnedCardQuantityDto>): void;
}
