import { DialogBody, Tab, Tabs } from "@blueprintjs/core";
import * as React from "react";

import { BasicConfigurationView } from "../basic-configuration-view/basic-configuration-view";
import { ConfigurationViewProps } from "./configuration-view.props";

export function ConfigurationView(props: ConfigurationViewProps) {
  //#region Main --------------------------------------------------------------
  return (
    <DialogBody>
      <Tabs animate={true} defaultSelectedTabId="basic" renderActiveTabPanelOnly={true}>
        <Tab title="Basic" key="Basic" id="basic" panel={<BasicConfigurationView {...props}/>}/>
        <Tab title="Advanced" key="Advanced" panel={<p>comes soon</p>} />
      </Tabs>
    </DialogBody>
  );
  //#endregion
}
