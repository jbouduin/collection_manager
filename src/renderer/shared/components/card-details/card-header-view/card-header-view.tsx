import { H3, H5 } from "@blueprintjs/core";
import * as React from "react";
import { IMtgCardSetDto } from "../../../../../common/dto";
import { CardSetContext } from "../../../context";
import { SvgProvider } from "../../svg-provider/svg-provider";
import { compareClassNameProp, getRarityColorClassname } from "../../utils";
import { CardHeaderViewProps } from "./card-header-view.props";


export const CardHeaderView = React.memo(
  (props: CardHeaderViewProps) => {
    //#region Main --------------------------------------------------------------
    return (
      <CardSetContext.Consumer>
        {
          (cardSets: Array<IMtgCardSetDto>) => (
            <>
              <div className="card-header-line-1">
                <SvgProvider
                  className={getRarityColorClassname(props.card.rarity)}
                  height={25}
                  svg={cardSets.find((cardSet: IMtgCardSetDto) => cardSet.id == props.card.setId)?.svg}
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
  },
  (prev: CardHeaderViewProps, next: CardHeaderViewProps) => {
    return prev.card.cardName == next.card.cardName && compareClassNameProp(prev.className, next.className);
  }
);
