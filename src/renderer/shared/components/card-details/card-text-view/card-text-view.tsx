import * as React from "react";
import { CardSymbolContext } from "../../../context";
import { SvgProvider } from "../../svg-provider";
import { compareClassNameProp } from "../../utils";
import { CardTextViewProps } from "./card-text-view.props";


export const CardTextView = React.memo(
  (props: CardTextViewProps) => {
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
          .map((paragraph: string, idx: number) => (<p key={`p-${idx}`}>{splitParagraph(symbols, paragraph)}</p>));
      } else {
        return null;
      }
    }

    function splitParagraph(symbols: Map<string, string>, paragraph: string): Array<React.JSX.Element | string> {
      const matches = paragraph.match(/{[^}]*}|[^{}]+/gmi);

      return matches.map((match: string, idx: number) => {
        if (match.startsWith("{") && match.endsWith("}")) {
          const svg = symbols.get(match);
          return (
            <SvgProvider
              className="mana-cost-image-in-text"
              key={`s-${idx}`}
              svg={svg}
            />
          );
        } else {
          return match;
        }
      });
    }
    //#endregion
  },
  (prev: CardTextViewProps, next: CardTextViewProps) => {
    return prev.cardText == next.cardText && compareClassNameProp(prev.className, next.className);
  }
);
