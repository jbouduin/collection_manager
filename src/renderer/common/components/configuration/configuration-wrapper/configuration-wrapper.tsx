import { cloneDeep } from "lodash";
import * as React from "react";

import { DtoConfiguration } from "../../../../../common/dto/configuration/configuration.dto";
import { PostParam } from "../../../../../common/ipc-params";
import { ConfigurationViewModel } from "../../../../common/viewmodels/configuration/configuration.viewmodel";
import { ConfigurationView } from "../configuration-view/configuration-view";
import { FooterView } from "../footer-view/footer-view";
import { ConfigurationWrapperProps } from "./configuration-wrapper.props";

export function ConfigurationWrapper(props: ConfigurationWrapperProps) {

  // NOW check why we have configuration as state here and in settings dialog
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
      const params: PostParam<DtoConfiguration> = {
        type: "Configuration",
        data: toSave.dto
      };
      // check how to activate renderer settings immediately after saving
      window.ipc.post(params).then(() => props.onSave());

    },
    []
  );
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <>
      {
        configuration &&
        <>
          <ConfigurationView
            configuration={configuration}
            configurationChanged={(configuration: ConfigurationViewModel) => setConfiguration(cloneDeep(configuration))}
          />
          <FooterView
            configuration={configuration}
            onSave={onSave}
            onCancel={() => props.onCancel()}
          />
        </>
      }
    </>
  );
  //#endregion
}
