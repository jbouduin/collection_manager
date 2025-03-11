import { Props } from "@blueprintjs/core";
import { OwnedCardQuantityDto } from "../../../../common/dto";


export interface OwnedCardDialogProps extends Props {
  cardId: string;
  onClose(quantities: Array<OwnedCardQuantityDto>): void;
}
