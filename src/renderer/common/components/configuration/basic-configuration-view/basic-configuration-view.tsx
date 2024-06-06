import { Checkbox, FormGroup, Icon, InputGroup, SectionCard } from "@blueprintjs/core";
import * as React from "react";

import { SyncType, SyncTypeDisplayValue } from "../../../../../common/ipc-params";
import { ConfigurationViewProps } from "../configuration-view.props";

export function BasicConfigurationView(props: ConfigurationViewProps) {

  //#region Main --------------------------------------------------------------
  return (
    <SectionCard padded={false}>
      <FormGroup label="Data directory" labelInfo="required" labelFor="root-data-directory" key="root-data-directory">
        <InputGroup
          id="root-data-directory"
          inputMode="text"
          value={props.configuration.rootDataDirectory}
          rightElement={<Icon icon="folder-open" />}
          small={true}
        />
      </FormGroup>
      <FormGroup label="Database name" labelInfo="required" labelFor="database-name" key="database-name">
        <InputGroup
          inputMode="text"
          id="database-name"
          value={props.configuration.databaseName}
          placeholder="Enter database name"
          small={true}
        />
      </FormGroup>
      <FormGroup label="Cache directory" labelInfo="required" labelFor="cache-directory" key="cache-directory">
        <InputGroup
          inputMode="text"
          id="cache-directory"
          value={props.configuration.cacheDirectory}
          rightElement={<Icon icon="folder-open" />}
          small={true}
        />
      </FormGroup>
      <FormGroup label="Synchronize at startup" key="sync-at-startup">
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          {
            renderStartup()
          }
        </div>
      </FormGroup>
    </SectionCard>
  );
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  function renderStartup(): Array<React.JSX.Element> {
    const result = new Array<React.JSX.Element>();
    SyncTypeDisplayValue.forEach((value: string, key: SyncType) => {
      result.push((<Checkbox label={value} checked={props.configuration.getSyncAtStartup(key)} />));
    });
    return result;
  }
  //#endregion
}
