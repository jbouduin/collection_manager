import { H3, H5 } from "@blueprintjs/core";
import * as React from "react";

import { CardRarity } from "../../../../../../common/enums";
import { CardSetViewmodel } from "../../../../viewmodels";
import { CardSetContext } from "../../../context";
import { SvgProvider } from "../../svg-provider/svg-provider";
import { CardHeaderViewProps } from "./card-header-view.props";


export function CardHeaderView(props: CardHeaderViewProps) {
  console.log("in CardHeaderView function");

  //#region Main --------------------------------------------------------------
  return (
    <CardSetContext.Consumer>
      {
        (cardSets: Array<CardSetViewmodel>) => (
          <>
            <div className="card-header-line-1">
              <SvgProvider
                svg={cardSets.find((cardSet: CardSetViewmodel) => cardSet.id == props.card.setId)?.cardSetSvg}
                height={25}
                width={25}
                className={getRarityColorClassname(props.card.rarity)}
              />
              <H3>{props.card.cardName}</H3>
            </div>
            <div className="card-header-line-2" style={{ "width": "100%" }}>
              <H5>{props.card.cardtypeLine}</H5>
            </div>
          </>
        )
      }
    </CardSetContext.Consumer>
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
