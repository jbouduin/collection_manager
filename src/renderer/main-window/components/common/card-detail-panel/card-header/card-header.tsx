import { SectionCard } from "@blueprintjs/core";
import * as React from "react";

import { CardDetailPanelProps } from "../card-detail-panel.props";

export function CardHeader(props: CardDetailPanelProps) {

  //#region Main --------------------------------------------------------------
  // NOW correct
  return (
    <SectionCard padded={true} className={props.className}>
      <h3>props.card.card.name</h3>
    </SectionCard>
  );
  // <h3>{props.card.card.name}</h3>
  //#endregion
}
