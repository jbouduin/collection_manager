import { H5, Section, SectionCard, Tab, Tabs } from "@blueprintjs/core";
import * as React from "react";

import { CardfaceViewProps } from "./card-face-view.props";
import { CardSymbolProvider } from "../../card-symbol-provider/card-symbol-provider";
import { OracleView } from "../oracle-view/oracle-view";
import { PrintedView } from "../printed-view/printed-view";

export function CardfaceView(props: CardfaceViewProps) {
  console.log("in cardfaceview function");

  //#region Main --------------------------------------------------------------
  return (
    <Section
      compact={true}
      collapsible={true}
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
      rightElement={<CardSymbolProvider cardSymbols={props.cardface.manaCost} className="mana-cost-image-in-title" />}
    >

      <SectionCard className="card-view-section-card" padded={false}>
        <Tabs animate={true} id="card-detail-tabs" defaultSelectedTabId="Oracle0" renderActiveTabPanelOnly={true}>
          <Tab
            id="Oracle0"
            title="Oracle"
            panel={<OracleView oracle={props.oracle} />}
          />
          <Tab
            id="Printed0"
            title="Printed"
            panel={<PrintedView cardface={props.cardface} />}
          />
        </Tabs>
      </SectionCard>
    </Section>
  );
  //#endregion
}
