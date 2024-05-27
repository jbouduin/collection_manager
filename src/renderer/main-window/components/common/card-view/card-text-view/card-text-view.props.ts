import { Props } from "@blueprintjs/core";

export interface CardTextViewProps extends Props {
  cardText: string;
  symbolSvgs: Map<string, string>;
}
