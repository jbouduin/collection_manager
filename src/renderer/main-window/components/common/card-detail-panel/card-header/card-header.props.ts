import { Props } from "@blueprintjs/core";
import { CardViewmodel } from "../../../../viewmodels";

export interface CardHeaderProps extends Props {
  card: CardViewmodel;
  cardSetSvg: string;
  symbolSvgs: Map<string, string>;
}
