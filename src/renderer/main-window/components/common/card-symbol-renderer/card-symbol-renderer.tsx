import * as React from "react";
import { CardSymbolRendererProps } from "./card-symbol-renderer.props";
import { SvgProvider } from "../svg-provider/svg-provider";
import { CardSymbolContext } from "../../context";
import { isEmpty, xor } from "lodash";


export const CardSymbolRenderer = React.memo(
  (props: CardSymbolRendererProps) => {
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
  },
  (prev: CardSymbolRendererProps, next: CardSymbolRendererProps) => {
    return isEmpty(xor(prev.cardSymbols, next.cardSymbols));
  }
);
