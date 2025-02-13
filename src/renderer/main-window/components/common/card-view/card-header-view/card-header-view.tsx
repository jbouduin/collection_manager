import { H3, H5 } from "@blueprintjs/core";
import * as React from "react";
import { CardRarity } from "../../../../../../common/types";
import { CardSetViewmodel } from "../../../../viewmodels";
import { CardSetContext } from "../../../context";
import { SvgProvider } from "../../svg-provider/svg-provider";
import { CardHeaderViewProps } from "./card-header-view.props";


export function CardHeaderView(props: CardHeaderViewProps) {
  //#region Main --------------------------------------------------------------
  return (
    <CardSetContext.Consumer>
      {
        (cardSets: Array<CardSetViewmodel>) => (
          <>
            <div className="card-header-line-1">
              <SvgProvider
                className={getRarityColorClassname(props.card.rarity)}
                height={25}
                svg={cardSets.find((cardSet: CardSetViewmodel) => cardSet.id == props.card.setId)?.cardSetSvg}
                width={25}
              />
              <H3>{props.card.cardName}</H3>
            </div>
            <div className="card-header-line-2" style={{ width: "100%" }}>
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
