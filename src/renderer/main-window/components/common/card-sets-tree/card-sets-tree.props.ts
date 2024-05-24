import { Props } from "@blueprintjs/core";
import { DtoCardSet } from "../../../../../common/dto";

export interface CardSetTreeProps extends Props {
  cardSets: Array<DtoCardSet>;
  onSetsSelected(sets: Array<DtoCardSet>): void;
}
