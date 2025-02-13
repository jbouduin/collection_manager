
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

  return (
    <svg
      className={props.className}
      dangerouslySetInnerHTML={{ __html: path }}
      height={props.height ?? 16}
      role="img"
      viewBox={viewbox}
      width={props.width ?? 16}
    />
  );
  //#endregion
}
