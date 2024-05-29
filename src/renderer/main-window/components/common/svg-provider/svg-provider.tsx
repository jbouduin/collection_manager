
import * as React from "react";
import { SvgProviderProps } from "./svg-provider.props";

export function SvgProvider(props: SvgProviderProps) {
  //#region Main --------------------------------------------------------------
  const start = props.svg.indexOf(">");
  const end = props.svg.indexOf("</svg");
  const path = props.svg.substring(start + 1, end);

  const parser = new DOMParser();
  const document = parser.parseFromString(props.svg, "text/html");
  const viewbox = document.body.firstElementChild.attributes.getNamedItem("viewBox").value;
  // TODO color="white"  stroke = "white" works in some cases only
  return (
    <span aria-hidden="true" className="bp5-icon bp5-icon-record">
      <svg
        viewBox={viewbox}
        role="img"
        height={props.height ?? 16}
        width={props.width ?? 16}
        dangerouslySetInnerHTML={{ __html: path }}>
      </svg>
    </span>
  );
  //#endregion
}
