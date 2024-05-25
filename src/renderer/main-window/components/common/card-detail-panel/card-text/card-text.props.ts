import { Props } from "@blueprintjs/core";

export interface CardTextProps extends Props {
  cardText: string;
  symbolSvgs: Map<string, string>;
}
