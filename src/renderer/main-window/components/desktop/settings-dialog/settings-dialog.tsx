import { Classes, Dialog } from "@blueprintjs/core";
import * as React from "react";
import { RendererConfigurationDto } from "../../../../../common/dto";
import { ConfigurationDto } from "../../../../../common/dto/";
import { QueryParam } from "../../../../../common/ipc-params";
import { BaseDialogProps } from "../../../../common/components/base-dialog-props";
import { ConfigurationWrapper } from "../../../../common/components/configuration/configuration-wrapper/configuration-wrapper";
import { ConfigurationViewModel } from "../../../../common/viewmodels/configuration/configuration.viewmodel";
import { ConfigurationContext } from "../../context";

export function SettingsDialog(props: BaseDialogProps) {
  //#region State -----------------------------------------------------------------------
  const [configuration, setConfiguration] = React.useState<ConfigurationViewModel>(undefined);
  //#endregion

  //#region Effect ----------------------------------------------------------------------
  React.useEffect(
    () => {
      const queryParam: QueryParam<null> = {
        type: "Configuration",
        options: null
      };
      void window.ipc.query(queryParam)
        .then((configuration: ConfigurationDto) => setConfiguration(new ConfigurationViewModel(configuration, false)));
    },
    [props.isOpen]
  );
  //#endregion

  //#region Main ------------------------------------------------------------------------
  return (
    <ConfigurationContext.Consumer>
      {
        (rendererConfiguration: RendererConfigurationDto) => (
          <Dialog
            canEscapeKeyClose={true}
            className={rendererConfiguration.useDarkTheme ? Classes.DARK : ""}
            isCloseButtonShown={true}
            isOpen={props.isOpen}
            onClose={() => props.onDialogClose()}
            shouldReturnFocusOnClose={true}
            style={{ minWidth: "800px" }}
            title="Settings"
          >
            <ConfigurationWrapper
              configuration={configuration}
              onCancel={() => props.onDialogClose()}
              onSave={() => props.onDialogClose()}
            />
          </Dialog>
        )
      }
    </ConfigurationContext.Consumer>
  );
  //#endregion
}
