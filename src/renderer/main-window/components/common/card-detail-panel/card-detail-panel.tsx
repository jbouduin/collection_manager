import { Section, SectionCard, Tab, Tabs } from "@blueprintjs/core";
import * as React from "react";


import { LanguageButtonBar } from "../language-button-bar/language-button-bar";
import { Oracle } from "../oracle/oracle";
import { CardDetailPanelProps } from "./card-detail-panel.props";
import { CardHeader } from "./card-header/card-header";
import { CardImage } from "./card-image/card-image";
import { CardRulings } from "./card-rulings/card-rulings";

export function CardDetailPanel(props: CardDetailPanelProps) {

  // FEATURE: cards with multiple faces:
  // for reversible cards:
  //  have two CardImage components and a turn over button
  //  display the details of the visible face
  // for non-reversible cards:
  //  use collapsible panels which display details of a face
  //#region Main --------------------------------------------------------------
  return (props.card ?
    <Section className={props.className}>
      <CardHeader {...props} />
      {props.card.isMultipleLanguage &&
        <LanguageButtonBar className={props.className} cardLanguages={props.card.languages} languages={props.languages} />
      }
      <CardImage {...props} />
      <SectionCard padded={true} className={props.className}>
        <Tabs animate={true} className={props.className} id="card-detail-tabs" defaultSelectedTabId="Oracle" renderActiveTabPanelOnly={true}>
          <Tab id="Oracle" title="Oracle" panel={<Oracle className={props.className} card={props.card} />} />
          <Tab id="Printed" title="Printed" />
        </Tabs>
      </SectionCard>
      <SectionCard padded={true} className={props.className}>
        <Tabs animate={true} className={props.className} id="card-detail-tabs" defaultSelectedTabId="Rulings" renderActiveTabPanelOnly={true}>
          <Tab id="Rulings" title="Rulings" panel={<CardRulings card={props.card} />} />
          <Tab id="other_info" title="Other info" />
        </Tabs>
      </SectionCard>
    </Section>
    : <Section className={props.className} ></Section>

  );
  //#endregion
}
