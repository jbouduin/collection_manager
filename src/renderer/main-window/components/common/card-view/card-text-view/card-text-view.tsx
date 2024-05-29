import * as React from "react";

import { CardTextViewProps } from "./card-text-view.props";
import { SvgProvider } from "../../svg-provider/svg-provider";


export function CardTextView(props: CardTextViewProps) {
  //#region Main --------------------------------------------------------------
  return (
    <div>
      {
        render()
      }
    </div>
  );
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  function render(): Array<React.JSX.Element | string> {
    if (props.cardText?.length > 0) {
      return props.cardText
        .replace(/\r\n/g, "\r")
        .replace(/\n/g, "\r")
        .split(/\r/)
        .map((paragraph: string) => <p>{splitParagraph(paragraph)}</p>);
    } else {
      return null;
    }
  }

  function splitParagraph(paragraph: string): Array<React.JSX.Element | string> {
    const matches = paragraph.match(/{[^}]*}|[^{}]+/gmi);

    return matches.map((match: string) => {
      if (match.startsWith("{") && match.endsWith("}")) {
        const svg = props.symbolSvgs.get(match);
        return (<SvgProvider svg={svg} />);
      } else {
        return match;
      }
    });
  }
  //#endregion
}
