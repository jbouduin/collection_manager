import * as React from "react";

import { CardTextProps } from "./card-text.props";
import { SvgProvider } from "../../svg-provider/svg-provider";


export function CardText(props: CardTextProps) {
  //#region Main --------------------------------------------------------------
  return (
    <div>
      {
        props.cardText
          .replace(/\r\n/g, "\r")
          .replace(/\n/g, "\r")
          .split(/\r/)
          .map((paragraph: string) => <p>{splitParagraph(paragraph)}</p>)
      }
    </div>
  );
  //#endregion

  //#region Helper functions --------------------------------------------------
  function splitParagraph(paragraph: string): Array<React.JSX.Element | string> {
    const matches = paragraph.match(/{[^}]*}|[^{}]+/gmi);

    return matches.map((match: string) => {
      if (match.startsWith("{") && match.endsWith("}")) {
        const svg = props.symbolSvgs.get(match);
        return (<SvgProvider className={props.className} svg={svg} />);
      } else {
        return match;
      }
    });
  }
  //#endregion
}
