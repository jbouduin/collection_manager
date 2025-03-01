import { DialogBody, Tab, Tabs } from "@blueprintjs/core";
import * as React from "react";
import { SyncParameterView } from "../../sync-parameter-view/sync-parameter-view";
import { DataConfigurationView } from "../data-configuration-view/data-configuration-view";
import { DatabaseViewConfigurationView } from "../database-view-configuration-view/database-view-configuration-view";
import { ConfigurationViewProps } from "./configuration-view.props";
import { IpcProxyService, IpcProxyServiceContext } from "../../../context";
import { CatalogTypeDto } from "../../../../../common/dto";

// LATER add logServerResponses and debuglevel (consider adding a different part in configurationdto for system settings)
export function ConfigurationView(props: ConfigurationViewProps) {
  //#region State -----------------------------------------------------------------------
  const [state, setState] = React.useState<Array<CatalogTypeDto>>(new Array<CatalogTypeDto>());
  //#endregion

  //#region Context -----------------------------------------------------------
  const ipcProxyService = React.useContext<IpcProxyService>(IpcProxyServiceContext);
  //#endregion

  //#region Effects -----------------------------------------------------------
  React.useEffect(
    () => {
      void ipcProxyService.getData<Array<CatalogTypeDto>>("/catalog").then((r: Array<CatalogTypeDto>) => setState(r));
    },
    []
  );
  //#endregion

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
          id="basic"
          key="basic"
          panel={
            <DataConfigurationView
              configuration={props.configuration.dataConfigurationViewmodel}
              isFirstUse={props.configuration.isFirstUse}
              onConfigurationChanged={onDataConfigurationChanged}
            />
          }
          title="Basic"
        />
        <Tab
          id="database-view"
          key="database-view"
          panel={
            <DatabaseViewConfigurationView
              configuration={props.configuration.databaseViewConfigurationViewmodel}
              onConfigurationChanged={onDatabaseViewTreeConfigurationChanged}
            />
          }
          title="Database view defaults"
        />
        <Tab
          id="collection-view"
          key="collection-view"
          panel={<p>coming soon</p>}
          title="Collection view defaults"
        />
        <Tab
          id="deck-view"
          key="deck-view"
          panel={<p>coming soon</p>}
          title="Deck view defaults"
        />
        <Tab
          id="sync-at-startup"
          key="sync-at-startup"
          panel={
            <SyncParameterView
              catalogs={state}
              onSyncParamChanged={onSyncParamChanged}
              syncParam={props.configuration.syncParamViewmodel}
            />
          }
          title="Synchronize at startup"
        />
        <Tab
          id="advanced"
          key="advanced"
          panel={<p>comes soon</p>}
          title="Advanced"
        />
      </Tabs>
    </DialogBody>
  );
  //#endregion
}
