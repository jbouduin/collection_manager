import { Props } from "@blueprintjs/core";
import { OwnedCardQuantityViewmodel } from "../../../viewmodels";
import { CardCondition } from "../../../../../common/types";

export interface OwnedCardTableProps extends Props {
  quantities: Array<OwnedCardQuantityViewmodel>;
  readOnly: boolean;

  onQuantityChanged(conditionId: CardCondition, isFoil: boolean, newQuantity: number): void;
}
