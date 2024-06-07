import { Card, Section } from "@blueprintjs/core";
import * as React from "react";

import classNames from "classnames";
import { ConfigurationWrapper } from "../../common/components/configuration/configuration-wrapper/configuration-wrapper";
import { FirstTimeViewProps } from "./first-time-view.props";

export function FirstTimeView(props: FirstTimeViewProps) {

  //#region Main --------------------------------------------------------------
  return (
    <Card className={classNames(props.className, "desktop-wrapper")} compact={true}>
      <Section compact={true}>
        <ConfigurationWrapper
          configuration={props.configuration}
          onCancel={() => window.close()}
          onSave={() => window.close()}
        />
      </Section>
    </Card>
  );
  //#endregion
}
