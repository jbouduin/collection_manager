import { H5, Section, SectionCard, Tab, Tabs } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";

import { CardSymbolProvider } from "../../card-symbol-provider/card-symbol-provider";
import { CardTextView } from "../card-text-view/card-text-view";
import { CardfaceViewProps } from "./card-face-view.props";

export function CardfaceView(props: CardfaceViewProps) {
  //#region Rendering ---------------------------------------------------------
  return (
    <Section
      collapsible={true}
      compact={true}
      rightElement={<CardSymbolProvider cardSymbols={props.cardface.manaCost} className="mana-cost-image-in-title" />}
      title={
        <>
          <div className="card-header-line-1">
            <H5>{props.cardface.printedName}</H5>
          </div>
          <div>
            {props.cardface.printedTypeLine}
          </div>
        </>
      }
    >
      <SectionCard className="card-view-section-card" padded={false}>
        <Tabs
          animate={true}
          defaultSelectedTabId="Oracle0"
          id="card-detail-tabs"
          renderActiveTabPanelOnly={true}
        >
          <Tab
            id="Oracle0"
            panel={<CardTextView cardText={props.oracle?.oracleText} />}
            title="Oracle"
          />
          <Tab
            id="Printed0"
            panel={
              <>
                <CardTextView cardText={props.cardface.printedText} />
                {
                  props.cardface.hasFlavorText &&
                  <div>
                    <p className={classNames("bp5-divider", "ruling-divider")} />
                    <p><i>{props.cardface.flavorText}</i></p>
                  </div>
                }
              </>
            }
            title="Printed"
          />
        </Tabs>
      </SectionCard>
    </Section>
  );
  //#endregion
}
