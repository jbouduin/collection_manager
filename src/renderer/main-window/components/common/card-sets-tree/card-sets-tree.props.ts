import { Props } from "@blueprintjs/core";
import { CardSetDto } from "../../../../../common/dto";

export interface CardSetTreeProps extends Props {
  cardSets: Array<CardSetDto>;
  onSetsSelected(sets: Array<CardSetDto>): void;
}
