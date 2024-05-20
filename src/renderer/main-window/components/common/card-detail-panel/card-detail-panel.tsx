import { Card, CardList, H3, H5, Section, SectionCard, Tab, Tabs } from "@blueprintjs/core";
import * as React from "react";
import { CardImage } from "./card-image/card-image";

import { CardDto } from "../../../../../common/dto";
import { SvgProvider } from "../svg-provider/svg-provider";
import { CardContent } from "./card-content/card-content";
import { CardDetailPanelProps } from "./card-detail-panel.props";
import { CardRulings } from "./card-rulings/card-rulings";

export function CardDetailPanel(props: CardDetailPanelProps) {

  function buildTitle(card: CardDto): React.JSX.Element {
    // TODO cards with "released_at" in the future are unreleased and should be marked as such
    // NOW correct fields
    return (
      <div>
        <H3> <SvgProvider svg={props.cardSet.svg} height={25} width={25} /> card.card.name </H3>
        <H5 >card.card.type_line </H5>
      </div>
    );
  }
  // LATER: cards with multiple faces:
  // for reversible cards:
  //  have two CardImage components and a turn over button
  //  display the details of the visible face
  // for non-reversible cards:
  //  use collapsible panels which display details of a face
  //#region Main --------------------------------------------------------------
  return (
    <CardList compact={true} bordered={false} className={props.className}>
      <Card compact={true}>
        <CardImage {...props} />
      </Card>
      <Card compact={true}>
        {props.card &&
          <Section title={buildTitle(props.card)}  className={props.className}>
            <CardContent {...props} />
            <SectionCard padded={true} className={props.className}>
            <Tabs animate={true} className={props.className} id="card-detail-tabs" defaultSelectedTabId="rulings" renderActiveTabPanelOnly={true}>
                <Tab id="rulings" title="Rulings" panel={<CardRulings card={props.card}></CardRulings>} />

              <Tab id="other_info" title="Other info"/>
              </Tabs>
            </SectionCard>
          </Section>
        }
      </Card>
    </CardList>
  );
  //#endregion
}
