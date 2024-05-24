
import * as React from "react";
import { SvgProviderProps } from "./svg-provider.props";

export function SvgProvider(props: SvgProviderProps) {
  //#region Main --------------------------------------------------------------
  const start = props.svg.indexOf(">");
  const end = props.svg.indexOf("</svg");
  const path = props.svg.substring(start + 1, end);
  // TODO use viewbox from original svg or try to fetch the svg as cached-image
  return (
    <span aria-hidden="true" className="bp5-icon bp5-icon-record">
      <svg
        className={props.className}
        viewBox="0 0 100 100"
        role="img"
        height={props.height ?? 16}
        width={props.width ?? 16}
        dangerouslySetInnerHTML={{ __html: path }}>
      </svg>
    </span>
  );
  //#endregion
}
