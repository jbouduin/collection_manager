import { Props } from "@blueprintjs/core";
import { CardSetSelectDto } from "../../../../common/dto";

export interface DatabaseViewProps extends Props {
  cardSets: Array<CardSetSelectDto>;
}
