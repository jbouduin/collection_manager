import * as React from "react";

import { CardSymbolProviderProps } from "./card-symbol-provider.props";
import { SvgProvider } from "../svg-provider/svg-provider";

export function CardSymbolProvider(props: CardSymbolProviderProps) {
  return (
    <div>
      {
        props.cardSymbols
          .map((cardSymbol: string, idx: number) => {
            if (cardSymbol == "//") {
              return (<span>&nbsp; &nbsp;//&nbsp;&nbsp;</span>);
            } else if (cardSymbol == "-") {
              return (<span>&nbsp; &nbsp;-&nbsp;&nbsp;</span>);
            } else {
              const symbolSvg = props.symbolSvgs.get(cardSymbol);
              if (symbolSvg) {
                return (<SvgProvider className="mana-cost-image" svg={props.symbolSvgs.get(cardSymbol)} key={`manacost_${idx}`} />);
              } else {
                console.log(`no cached svg for "${cardSymbol}"`);
                return;
              }
            }
          })
      }
    </div >
  );
}
