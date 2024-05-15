import { Props } from "@blueprintjs/core";
import { CardSetSelectDto } from "../../../../../common/dto";

export interface CardSetTreeProps extends Props {
  cardSets: Array<CardSetSelectDto>;
  onSetsSelected(setIds: Array<string>): void;
}
