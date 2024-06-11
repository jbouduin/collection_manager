import * as React from "react";

import { CardSymbolProviderProps } from "./card-symbol-provider.props";
import { SvgProvider } from "../svg-provider/svg-provider";
import { CardSymbolContext } from "../../context";

export function CardSymbolProvider(props: CardSymbolProviderProps) {

  //#region Main --------------------------------------------------------------
  console.log("in CardSymbolProvider function");
  return (
    <>
      <CardSymbolContext.Consumer>
        {
          (symbols: Map<string, string>) => (
            <div>
              {
                props.cardSymbols
                  .map((cardSymbol: string, idx: number) => {
                    if (cardSymbol == "//") {
                      return (<span key={`s-${idx}`}>&nbsp; &nbsp;//&nbsp;&nbsp;</span>);
                    } else if (cardSymbol == "-") {
                      return (<span key={`s-${idx}`}>&nbsp; &nbsp;-&nbsp;&nbsp;</span>);
                    } else {
                      const symbolSvg = symbols.get(cardSymbol);
                      if (symbolSvg) {
                        return (<SvgProvider svg={symbolSvg} className={props.className} key={`s-${idx}`} />);
                      } else {
                        console.log(`no cached svg for "${cardSymbol}"`);
                        return;
                      }
                    }
                  })
              }
            </div>
          )
        }
      </CardSymbolContext.Consumer>
    </ >
  );
  //#endregion
}
