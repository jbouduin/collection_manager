import { H5, H6, SectionCard } from "@blueprintjs/core";
import * as React from "react";

import { LocalizedCardHeaderProps } from "./localized-card-header.props";


export function LocalizedCardHeader(props: LocalizedCardHeaderProps) {

  //#region Main --------------------------------------------------------------
  return (
    <SectionCard padded={true} className={props.className}>
      <div className="card-header-wrapper">
        <div className="card-header-line-1">
          <H5>  {props.card.printedName} </H5>
        </div>
        <div className="card-header-line-2">
          <H6 >{props.card.printedTypeLine} </H6>
        </div>
      </div>
    </SectionCard>
  );
  //#endregion
}
