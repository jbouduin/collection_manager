import { H5, Section, SectionCard, Tab, Tabs } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";

import { CardSymbolProvider } from "../../card-symbol-provider/card-symbol-provider";
import { CardTextView } from "../card-text-view/card-text-view";
import { CardfaceViewProps } from "./card-face-view.props";

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
            panel={<CardTextView cardText={props.oracle?.oracleText} />}
          />
          <Tab
            id="Printed0"
            title="Printed"
            panel={
              <>
                <CardTextView cardText={props.cardface.printedText} />
                {
                  props.cardface.hasFlavorText &&
                  <div>
                    <p className={classNames("bp5-divider", "ruling-divider")}></p>
                    <p><i>{props.cardface.flavorText}</i></p>
                  </div>
                }
              </>
            }
          />
        </Tabs>
      </SectionCard>
    </Section>
  );
  //#endregion
}
