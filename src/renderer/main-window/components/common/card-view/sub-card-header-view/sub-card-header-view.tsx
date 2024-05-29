import { H5, H6, SectionCard } from "@blueprintjs/core";
import * as React from "react";

import { SubCardHeaderViewProps } from "./sub-card-header-view.props";
import { CardSymbolProvider } from "../../card-symbol-provider/card-symbol-provider";


export function SubCardHeaderView(props: SubCardHeaderViewProps) {

  //#region Main --------------------------------------------------------------
  return (
    <SectionCard padded={true}>
      <div className="card-header-wrapper">
        <div className="card-header-line-1">
          <H5>  {props.cardface.printedName} </H5>
        </div>
        <div className="card-header-line-2">
          <H6 >{props.cardface.printedTypeLine} </H6>
          {
            props.showManaCost &&
            <CardSymbolProvider symbolSvgs={props.symbolSvgs} cardSymbols={props.cardface.manaCost} />
          }
        </div>
      </div>
    </SectionCard>
  );
  //#endregion
}
