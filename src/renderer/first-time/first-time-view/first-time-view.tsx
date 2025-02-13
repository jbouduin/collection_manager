import { Card, Section } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";
import { ConfigurationWrapper } from "../../common/components/configuration/configuration-wrapper/configuration-wrapper";
import { FirstTimeViewProps } from "./first-time-view.props";
import { DisplayValueService, DisplayValueServiceContext } from "../../common/context";

export function FirstTimeView(props: FirstTimeViewProps) {
  //#region Rendering ---------------------------------------------------------
  return (
    <DisplayValueServiceContext.Provider value={new DisplayValueService()}>
      <Card className={classNames(props.className, "desktop-wrapper")} compact={true}>
        <Section compact={true}>
          <ConfigurationWrapper
            configuration={props.configuration}
            onCancel={() => window.close()}
            onSave={() => window.close()}
          />
        </Section>
      </Card>
    </DisplayValueServiceContext.Provider>
  );
  //#endregion
}
