import { Props } from "@blueprintjs/core";
import { CardViewmodel } from "../../../../view-models";

export interface CardHeaderProps extends Props {
  card: CardViewmodel;
  cardSetSvg: string;
  symbolSvgs: Map<string,string>
}
