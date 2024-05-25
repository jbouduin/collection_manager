import { H3, H5, SectionCard } from "@blueprintjs/core";
import * as React from "react";

import { ManaCost } from "../../mana-cost/mana-cost";
import { SvgProvider } from "../../svg-provider/svg-provider";
import { CardHeaderProps } from "./card-header.props";


export function CardHeader(props: CardHeaderProps) {


  //#region Main --------------------------------------------------------------
  return (
    <SectionCard padded={true} className={props.className}>
      <div className="card-header-wrapper">
        <div className="card-header-line-1">
          <SvgProvider svg={props.cardSetSvg} height={25} width={25} />
          <H3>  {props.card.cardName} </H3>
        </div>
        <div className="card-header-line-2">
          <H5 >{props.card.cardtypeLine} </H5>
          <ManaCost cachedSvg={props.symbolSvgs} manacost={props.card.cardManacost} />
        </div>
      </div>
    </SectionCard>
  );
  //#endregion
}
