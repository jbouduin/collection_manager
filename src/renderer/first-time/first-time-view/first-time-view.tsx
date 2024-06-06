import { Card, Section } from "@blueprintjs/core";
import * as React from "react";

import classNames from "classnames";
import { ConfigurationView } from "../../common/components/configuration/configuration-view";
import { FooterView } from "../../common/components/configuration/footer-view/footer-view";
import { FirstTimeViewProps } from "./first-time-view.props";

export function FirstTimeView(props: FirstTimeViewProps) {

  //#region Event handling ----------------------------------------------------
  const onSave = React.useCallback(
    () => {
      console.log("save ");
    },
    []
  );

  const onCancel = React.useCallback(() => {
    console.log("cancel");
  },
    []
  );
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <Card className={classNames(props.className, "desktop-wrapper")} compact={true}>
      <Section compact={true}>
        <ConfigurationView {...props}></ConfigurationView>
        <FooterView
          hasChanges={props.configuration.hasChanges}
          onSave={onSave}
          onCancel={onCancel}
        ></FooterView>
      </Section>
    </Card>
  );
  //#endregion
}
