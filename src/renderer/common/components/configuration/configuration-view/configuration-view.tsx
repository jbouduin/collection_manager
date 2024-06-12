import { DialogBody, Tab, Tabs } from "@blueprintjs/core";
import * as React from "react";

import { BasicConfigurationView } from "../basic-configuration-view/basic-configuration-view";
import { ConfigurationViewProps } from "./configuration-view.props";
import { SyncParameterView } from "../../sync-parameter-view/sync-parameter-view";
import { SyncParamViewmodel } from "../../../viewmodels/sync-param/sync-param.viewmodel";
import { DatabaseViewConfigurationView } from "../database-view-configuration-view/database-view-configuration-view";
import { DatabaseViewConfigurationViewmodel } from "../../../viewmodels/configuration/database-view-configuration.viewmodel";

export function ConfigurationView(props: ConfigurationViewProps) {
  //#region Event handling ----------------------------------------------------
  // NOW we probably can remove the parameters here
  const onSyncParamChanged = (_syncParam: SyncParamViewmodel) => {
    props.configurationChanged(props.configuration);
  };

  const onDatabaseViewConfigurationChanged = (_configuration: DatabaseViewConfigurationViewmodel) => {
    props.configurationChanged(props.configuration);
  };
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <DialogBody>
      <Tabs animate={true} defaultSelectedTabId="basic" renderActiveTabPanelOnly={true}>
        <Tab title="Basic" key="basic" id="basic" panel={<BasicConfigurationView {...props} />} />
        <Tab title="Database view defaults"
          key="database-view"
          id="database-view"
          panel={
            <DatabaseViewConfigurationView
              configuration={props.configuration.databaseViewConfigurationViewmodel}
              onConfigurationChanged={onDatabaseViewConfigurationChanged}
            />
          }
        />
        <Tab title="Collection view defaults" key="collection-view" id="collection-view" panel={<p>coming soon</p>} />
        <Tab title="Deck view defaults" key="deck-view" id="deck-view" panel={<p>coming soon</p>} />
        <Tab title="Synchronize at startup" key="sync-at-startup" id="sync-at-startup" panel={<SyncParameterView syncParam={props.configuration.syncParamViewmodel} onSyncParamChanged={onSyncParamChanged} />} />
        <Tab title="Advanced" key="advanced" id="advanced" panel={<p>comes soon</p>} />
      </Tabs>
    </DialogBody>
  );
  //#endregion
}
