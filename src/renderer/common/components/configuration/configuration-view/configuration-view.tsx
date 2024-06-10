import { DialogBody, Tab, Tabs } from "@blueprintjs/core";
import * as React from "react";

import { BasicConfigurationView } from "../basic-configuration-view/basic-configuration-view";
import { ConfigurationViewProps } from "./configuration-view.props";
import { SyncParameterView } from "../../sync-parameter-view/sync-parameter-view";
import { SyncParamViewmodel } from "../../../viewmodels/sync-param/sync-param.viewmodel";

export function ConfigurationView(props: ConfigurationViewProps) {
  const onSyncParamChanged = (_syncParam: SyncParamViewmodel) => {
    props.configurationChanged(props.configuration);
};
  //#region Main --------------------------------------------------------------
  return (
    <DialogBody>
      <Tabs animate={true} defaultSelectedTabId="basic" renderActiveTabPanelOnly={true}>
        <Tab title="Basic" key="basic" id="basic" panel={<BasicConfigurationView {...props} />} />
        <Tab title="Synchronize at startup" key="sync-at-startup" id="sync-at-startup" panel={<SyncParameterView syncParam={props.configuration.syncParamViewmodel} onSyncParamChanged={onSyncParamChanged} />} />
        <Tab title="Advanced" key="advanced" id="advanced" panel={<p>comes soon</p>} />
      </Tabs>
    </DialogBody>
  );
  //#endregion
}
