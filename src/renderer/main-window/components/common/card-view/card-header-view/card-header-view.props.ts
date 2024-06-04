import { Props } from "@blueprintjs/core";
import { CardViewmodel } from "../../../../viewmodels";

export interface CardHeaderViewProps extends Props {
  card: CardViewmodel;
  cardSetSvg: string;
}
