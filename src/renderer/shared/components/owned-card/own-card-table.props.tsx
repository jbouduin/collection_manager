import { Props } from "@blueprintjs/core";
import { CardCondition } from "../../../../common/types";
import { OwnedCardQuantityViewmodel } from "../../viewmodels";

export interface OwnedCardTableProps extends Props {
  onQuantityChanged(conditionId: CardCondition, isFoil: boolean, newQuantity: number): void;
  quantities: Array<OwnedCardQuantityViewmodel>;
  readOnly: boolean;
}
