import { DialogBody, Tab, Tabs } from "@blueprintjs/core";
import * as React from "react";

import { SyncParameterView } from "../../sync-parameter-view/sync-parameter-view";
import { DataConfigurationView } from "../data-configuration-view/data-configuration-view";
import { DatabaseViewConfigurationView } from "../database-view-configuration-view/database-view-configuration-view";
import { ConfigurationViewProps } from "./configuration-view.props";

export function ConfigurationView(props: ConfigurationViewProps) {
  //#region Event handling ----------------------------------------------------
  const onSyncParamChanged = () => props.configurationChanged(props.configuration);

  const onDatabaseViewTreeConfigurationChanged = () => props.configurationChanged(props.configuration);

  const onDataConfigurationChanged = () => props.configurationChanged(props.configuration);
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <DialogBody>
      <Tabs animate={true} defaultSelectedTabId="basic" renderActiveTabPanelOnly={true}>
        <Tab
          title="Basic"
          key="basic"
          id="basic"
          panel={
            <DataConfigurationView
              configuration={props.configuration.dataConfigurationViewmodel}
              onConfigurationChanged={onDataConfigurationChanged}
            />
          }
        />
        <Tab title="Database view defaults"
          key="database-view"
          id="database-view"
          panel={
            <DatabaseViewConfigurationView
              configuration={props.configuration.databaseViewConfigurationViewmodel}
              onConfigurationChanged={onDatabaseViewTreeConfigurationChanged}
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
