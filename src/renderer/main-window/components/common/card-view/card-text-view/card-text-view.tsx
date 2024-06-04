import * as React from "react";

import { CardTextViewProps } from "./card-text-view.props";
import { SvgProvider } from "../../svg-provider/svg-provider";
import { CardSymbolContext } from "../../../context";


export function CardTextView(props: CardTextViewProps) {
  //#region Main --------------------------------------------------------------
  return (
    <CardSymbolContext.Consumer>
      {
        (symbols: Map<string, string>) => (
          <>
            {
              render(symbols)
            }
          </>)
      }

    </CardSymbolContext.Consumer>
  );
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  function render(symbols: Map<string, string>): Array<React.JSX.Element | string> {
    if (props.cardText?.length > 0) {
      return props.cardText
        .replace(/\r\n/g, "\r")
        .replace(/\n/g, "\r")
        .split(/\r/)
        .map((paragraph: string) => (<p>{splitParagraph(symbols, paragraph)}</p>));
    } else {
      return null;
    }
  }

  function splitParagraph(symbols: Map<string, string>, paragraph: string): Array<React.JSX.Element | string> {
    const matches = paragraph.match(/{[^}]*}|[^{}]+/gmi);

    return matches.map((match: string) => {
      if (match.startsWith("{") && match.endsWith("}")) {
        const svg = symbols.get(match);
        return (<SvgProvider svg={svg} />);
      } else {
        return match;
      }
    });
  }
  //#endregion
}
