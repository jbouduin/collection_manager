import { SectionCard } from "@blueprintjs/core";
import * as React from "react";

import { CardDetailPanelProps } from "../card-detail-panel.props";

export function CardContent(props: CardDetailPanelProps) {

  //#region Main --------------------------------------------------------------
  return (
    <SectionCard padded={true} className={props.className}>
      <p>{props.card.card.oracle_text}</p>
      <p><i>{props.card.card.flavor_text}</i></p>
      <p>{props.card.card.printed_name}</p>
      <p>{props.card.card.printed_text}</p>
    </SectionCard>
  );
  //#endregion
}
