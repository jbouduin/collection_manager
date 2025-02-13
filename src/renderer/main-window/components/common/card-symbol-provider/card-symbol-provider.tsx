import * as React from "react";
import { CardSymbolProviderProps } from "./card-symbol-provider.props";
import { SvgProvider } from "../svg-provider/svg-provider";
import { CardSymbolContext } from "../../context";

export function CardSymbolProvider(props: CardSymbolProviderProps) {
  //#region Rendering ---------------------------------------------------------
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
                        return (<SvgProvider className={props.className} key={`s-${idx}`} svg={symbolSvg} />);
                      } else {
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
