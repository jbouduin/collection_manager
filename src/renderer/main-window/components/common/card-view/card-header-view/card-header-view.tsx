import { H3, H5, SectionCard } from "@blueprintjs/core";
import * as React from "react";

import { CardSymbolProvider } from "../../card-symbol-provider/card-symbol-provider";
import { SvgProvider } from "../../svg-provider/svg-provider";
import { CardHeaderViewProps } from "./card-header-view.props";
import { CardRarity } from "../../../../../../common/enums";
import { CardSetContext } from "../../../context";
import { CardSetViewmodel } from "../../../../viewmodels";


export function CardHeaderView(props: CardHeaderViewProps) {
  //#region Main --------------------------------------------------------------
  return (
    <CardSetContext.Consumer>
      {
        (cardSets: Array<CardSetViewmodel>) =>
        (
          <SectionCard className="card-view-section-card">
            <div className="card-header-wrapper">
              <div className="card-header-line-1">
                <SvgProvider
                  svg={cardSets.find((cardSet: CardSetViewmodel) => cardSet.id == props.card.cardId)?.cardSetSvg}
                  height={25}
                  width={25}
                  className={getRarityColorClassname(props.card.rarity)}
                />
                <H3>{props.card.cardName}</H3>
              </div>
              <div className="card-header-line-2">
                <H5>{props.card.cardtypeLine}</H5>
                <CardSymbolProvider cardSymbols={props.card.cardManacost} />
              </div>
            </div>
          </SectionCard>
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
