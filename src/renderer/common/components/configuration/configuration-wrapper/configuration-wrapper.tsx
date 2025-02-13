import { cloneDeep } from "lodash";
import * as React from "react";
import { ConfigurationDto } from "../../../../../common/dto";
import { PostParam } from "../../../../../common/ipc-params";
import { ConfigurationViewModel } from "../../../../common/viewmodels/configuration/configuration.viewmodel";
import { ConfigurationView } from "../configuration-view/configuration-view";
import { FooterView } from "../footer-view/footer-view";
import { ConfigurationWrapperProps } from "./configuration-wrapper.props";

export function ConfigurationWrapper(props: ConfigurationWrapperProps) {
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
      const params: PostParam<ConfigurationDto> = {
        type: "Configuration",
        data: toSave.dto
      };
      // check how to activate renderer settings immediately after saving
      void window.ipc.post(params).then(() => props.onSave());
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
            onCancel={() => props.onCancel()}
            onSave={onSave}
          />
        </>
      }
    </>
  );
  //#endregion
}
