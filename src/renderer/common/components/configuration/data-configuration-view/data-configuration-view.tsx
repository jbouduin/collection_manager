import { FormGroup, InputGroup, SectionCard } from "@blueprintjs/core";
import * as React from "react";
import { handleStringChange } from "../../../utils";
import { DataConfigurationViewProps } from "./data-configuration-view.props";

export function DataConfigurationView(props: DataConfigurationViewProps) {
  //#region Main --------------------------------------------------------------
  return (
    <SectionCard padded={false}>
      <FormGroup
        key="root-data-directory"
        label="Data directory"
        labelFor="root-data-directory"
        labelInfo="required"
      >
        <InputGroup
          id="root-data-directory"
          inputMode="text"
          onChange={
            handleStringChange((value: string) => {
              props.configuration.rootDataDirectory = value;
              props.onConfigurationChanged();
            })
          }
          small={true}
          value={props.configuration.rootDataDirectory}
        />
      </FormGroup>
      <FormGroup
        key="database-name"
        label="Database name"
        labelFor="database-name"
        labelInfo="required"
      >
        <InputGroup
          id="database-name"
          inputMode="text"
          onChange={
            handleStringChange((value: string) => {
              props.configuration.databaseName = value;
              props.onConfigurationChanged();
            })
          }
          placeholder="Enter database name"
          small={true}
          value={props.configuration.databaseName}
        />
      </FormGroup>
      <FormGroup
        key="cache-directory"
        label="Cache directory"
        labelFor="cache-directory"
        labelInfo="required"
      >
        <InputGroup
          id="cache-directory"
          inputMode="text"
          onChange={
            handleStringChange((value: string) => {
              props.configuration.cacheDirectory = value;
              props.onConfigurationChanged();
            })
          }
          small={true}
          value={props.configuration.cacheDirectory}
        />
      </FormGroup>
    </SectionCard>
  );
  //#endregion
}
