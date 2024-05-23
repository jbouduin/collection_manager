import { SectionCard } from "@blueprintjs/core";
import * as React from "react";

import { CardDetailPanelProps } from "../card-detail-panel.props";

export function CardContent(props: CardDetailPanelProps) {

  //#region Main --------------------------------------------------------------
  return (
    <SectionCard padded={true} className={props.className}>
      <p>{props.card.oracleText}</p>
      <p><i>{props.card.flavorText}</i></p>
      <p>{props.card.printedName}</p>
      <p>{props.card.printedTypeLine}</p>
      <p>{props.card.printedText}</p>
    </SectionCard>
  );
  // FEATURE multi-language
  //#endregion
}
