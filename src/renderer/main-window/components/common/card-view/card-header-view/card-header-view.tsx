import { H3, H5 } from "@blueprintjs/core";
import * as React from "react";
import { MtgCardSetDto } from "../../../../../../common/dto";
import { getRarityColorClassname } from "../../../../../common/utils";
import { CardSetContext } from "../../../context";
import { SvgProvider } from "../../svg-provider/svg-provider";
import { CardHeaderViewProps } from "./card-header-view.props";


export function CardHeaderView(props: CardHeaderViewProps) {
  //#region Main --------------------------------------------------------------
  return (
    <CardSetContext.Consumer>
      {
        (cardSets: Array<MtgCardSetDto>) => (
          <>
            <div className="card-header-line-1">
              <SvgProvider
                className={getRarityColorClassname(props.card.rarity)}
                height={25}
                svg={cardSets.find((cardSet: MtgCardSetDto) => cardSet.id == props.card.setId)?.svg}
                width={25}
              />
              <H3>{props.card.cardName}</H3>
            </div>
            <div className="card-header-line-2" style={{ width: "100%" }}>
              <H5>{props.card.cardTypeLine}</H5>
            </div>
          </>
        )
      }
    </CardSetContext.Consumer>
  );
  //#endregion
}
