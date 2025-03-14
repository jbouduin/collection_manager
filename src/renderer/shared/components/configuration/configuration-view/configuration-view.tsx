import { DialogBody, Tab, Tabs } from "@blueprintjs/core";
import * as React from "react";
import { SyncParameterView } from "../../sync-parameter-view";
import { DataConfigurationView } from "../data-configuration-view/data-configuration-view";
import { DatabaseViewConfigurationView } from "../database-view-configuration-view/database-view-configuration-view";
import { ConfigurationViewProps } from "./configuration-view.props";
import { IIpcProxyService, IpcProxyServiceContext } from "../../../context";
import { ICatalogTypeDto } from "../../../../../common/dto";

// LATER add logServerResponses and debuglevel (consider adding a different part in configurationdto for system settings)
export function ConfigurationView(props: ConfigurationViewProps) {
  //#region State -----------------------------------------------------------------------
  const [state, setState] = React.useState<Array<ICatalogTypeDto>>(new Array<ICatalogTypeDto>());
  //#endregion

  //#region Context -----------------------------------------------------------
  const ipcProxyService = React.useContext<IIpcProxyService>(IpcProxyServiceContext);
  //#endregion

  //#region Effects -----------------------------------------------------------
  React.useEffect(
    () => {
      void ipcProxyService.getData<Array<ICatalogTypeDto>>("/catalog")
        .then(
          (r: Array<ICatalogTypeDto>) => setState(r),
          (_r: Error) => setState(new Array<ICatalogTypeDto>())
        );
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
          title="MTG view defaults"
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
              isConfigurationView={true}
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
