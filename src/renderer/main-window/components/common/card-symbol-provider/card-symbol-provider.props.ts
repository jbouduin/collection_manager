import { Props } from "@blueprintjs/core";

export interface CardSymbolProviderProps extends Props {
  cardSymbols: Array<string>;
  symbolSvgs: Map<string, string>;
}
