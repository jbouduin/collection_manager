import { Card, Section } from "@blueprintjs/core";
import * as React from "react";

import classNames from "classnames";
import { ConfigurationWrapper } from "../../common/components/configuration/configuration-wrapper/configuration-wrapper";
import { FirstTimeViewProps } from "./first-time-view.props";

export function FirstTimeView(props: FirstTimeViewProps) {

  //#region Event handling ----------------------------------------------------
  const onCancelOrSave = React.useCallback(
    () => window.close(),
    []
  );
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <Card className={classNames(props.className, "desktop-wrapper")} compact={true}>
      <Section compact={true}>
        <ConfigurationWrapper
          configuration={props.configuration}
          onCancel={onCancelOrSave}
          onSave={onCancelOrSave}
        />
      </Section>
    </Card>
  );
  //#endregion
}
