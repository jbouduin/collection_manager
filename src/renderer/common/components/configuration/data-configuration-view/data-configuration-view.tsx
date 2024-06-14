import { FormGroup, InputGroup, SectionCard } from "@blueprintjs/core";
import * as React from "react";

import { handleStringChange } from "../../../utils";
import { DataConfigurationViewProps } from "./data-configuration-view.props";

export function DataConfigurationView(props: DataConfigurationViewProps) {

  //#region Main --------------------------------------------------------------
  return (
    <SectionCard padded={false}>
      <FormGroup label="Data directory" labelInfo="required" labelFor="root-data-directory" key="root-data-directory">
        <InputGroup
          id="root-data-directory"
          inputMode="text"
          value={props.configuration.rootDataDirectory}
          // rightElement={<Icon icon="folder-open" />}
          small={true}
          onChange={
            handleStringChange((value: string) => {
              props.configuration.rootDataDirectory = value;
              props.onConfigurationChanged();
            })
          }
        />
      </FormGroup>
      <FormGroup label="Database name" labelInfo="required" labelFor="database-name" key="database-name">
        <InputGroup
          inputMode="text"
          id="database-name"
          value={props.configuration.databaseName}
          placeholder="Enter database name"
          small={true}
          onChange={
            handleStringChange((value: string) => {
              props.configuration.databaseName = value;
              props.onConfigurationChanged();
            })
          }
        />
      </FormGroup>
      <FormGroup label="Cache directory" labelInfo="required" labelFor="cache-directory" key="cache-directory">
        <InputGroup
          inputMode="text"
          id="cache-directory"
          value={props.configuration.cacheDirectory}
          // rightElement={<Icon icon="folder-open" />}
          small={true}
          onChange={
            handleStringChange((value: string) => {
              props.configuration.cacheDirectory = value;
              props.onConfigurationChanged();
            })
          }
        />
      </FormGroup>
    </SectionCard>
  );
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  //#endregion
}
