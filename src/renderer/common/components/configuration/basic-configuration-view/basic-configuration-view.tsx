import { FormGroup, InputGroup, SectionCard } from "@blueprintjs/core";
import * as React from "react";

import { handleStringChange } from "../../../../common/utils";
import { ConfigurationViewProps } from "../configuration-view/configuration-view.props";

export function BasicConfigurationView(props: ConfigurationViewProps) {

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
              props.configurationChanged(props.configuration);
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
              props.configurationChanged(props.configuration);
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
              props.configurationChanged(props.configuration);
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
