import { H3, H5, SectionCard } from "@blueprintjs/core";
import * as React from "react";

import { CardSymbolProvider } from "../../card-symbol-provider/card-symbol-provider";
import { SvgProvider } from "../../svg-provider/svg-provider";
import { CardHeaderViewProps } from "./card-header-view.props";
import { CardRarity } from "../../../../../../common/enums";


export function CardHeaderView(props: CardHeaderViewProps) {
  //#region Main --------------------------------------------------------------
  return (
    <SectionCard padded={true}>
      <div className="card-header-wrapper">
        <div className="card-header-line-1">
          <SvgProvider svg={props.cardSetSvg} height={25} width={25} colorClass={getRarityColorClassname(props.card.rarity)}/>
          <H3>{props.card.cardName}</H3>
        </div>
        <div className="card-header-line-2">
          <H5>{props.card.cardtypeLine}</H5>
          <CardSymbolProvider symbolSvgs={props.symbolSvgs} cardSymbols={props.card.cardManacost} />
        </div>
      </div>
    </SectionCard>
  );
  //#endregion

  //#region Auxiliary functions -----------------------------------------------
  function getRarityColorClassname(rarity: CardRarity) {
    switch (rarity) {
      case "uncommon":
        return "rarity-uncommon";
      case "rare":
        return "rarity-rare";
      case "mythic":
        return "rarity-mythic";
      default:
        return "";
    }
  }
  //#endregion
}
