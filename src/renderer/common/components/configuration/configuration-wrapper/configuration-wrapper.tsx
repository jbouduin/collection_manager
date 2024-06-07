import { cloneDeep } from "lodash";
import * as React from "react";

import { DtoConfiguration } from "../../../../../common/dto/configuration/configuration.dto";
import { PostParam } from "../../../../../common/ipc-params";
import { ConfigurationViewModel } from "../../../../common/viewmodels/configuration/configuration.viewmodel";
import { ConfigurationView } from "../configuration-view/configuration-view";
import { FooterView } from "../footer-view/footer-view";
import { ConfigurationWrapperProps } from "./configuration-wrapper.props";

export function ConfigurationWrapper(props: ConfigurationWrapperProps) {
  console.log("in ConfigurationWrapper function");

  //#region State -------------------------------------------------------------
  const [configuration, setConfiguration] = React.useState<ConfigurationViewModel>();
  //#endregion

  //#region Effect ------------------------------------------------------------
  React.useEffect(
    () => setConfiguration(props.configuration),
    [props.configuration]
  );
  //#endregion

  //#region Event handling ----------------------------------------------------
  const onSave = React.useCallback(
    (toSave: ConfigurationViewModel) => {
      console.log(toSave.dto);
      console.log(toSave);
      const params: PostParam<DtoConfiguration> = {
        type: "Configuration",
        data: toSave.dto
      };
      window.ipc.post(params).then(() => props.onSave());
    },
    []
  );

  const onCancel = React.useCallback(
    () => props.onCancel(),
    []
  );

  const onConfigurationChanged = React.useCallback(
    (configuration: ConfigurationViewModel) => setConfiguration(cloneDeep( configuration)),
    []
  );
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <>
      {configuration &&
        <>
          <ConfigurationView
            configuration={configuration}
            configurationChanged={onConfigurationChanged}
          />
          <FooterView
            configuration={configuration}
            onSave={onSave}
            onCancel={onCancel}
          />
        </>
      }
    </>
  );
  //#endregion
}
