import { Classes, Dialog } from "@blueprintjs/core";
import { noop } from "lodash";
import * as React from "react";
import { RendererConfigurationDto } from "../../../../../common/dto";
import { ConfigurationDto } from "../../../../../common/dto/";
import { BaseDialogProps } from "../../../../common/components/base-dialog-props";
import { ConfigurationWrapper } from "../../../../common/components/configuration/configuration-wrapper/configuration-wrapper";
import { IpcProxyService, IpcProxyServiceContext } from "../../../../common/context";
import { ConfigurationViewModel } from "../../../../common/viewmodels/configuration/configuration.viewmodel";
import { ConfigurationContext } from "../../context";
import { SettingsDialogProps } from "./settings-dialog.props";


export function SettingsDialog(props: SettingsDialogProps) {
  //#region State -----------------------------------------------------------------------
  const [configuration, setConfiguration] = React.useState<ConfigurationViewModel>(undefined);
  //#endregion

  //#region Context ---------------------------------------------------------------------
  const ipcProxyService = React.useContext<IpcProxyService>(IpcProxyServiceContext);
  //#endregion

  //#region Effect ----------------------------------------------------------------------
  React.useEffect(
    () => {
      if (props.isOpen) {
        void ipcProxyService
          .getData("/configuration")
          .then((configuration: ConfigurationDto) => setConfiguration(new ConfigurationViewModel(configuration, false)));
      }
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
              onSave={(toSave: ConfigurationDto) => {
                void ipcProxyService
                  .putData<ConfigurationDto, ConfigurationDto>("/configuration", toSave)
                  .then(
                    (saved: ConfigurationDto) => {
                      props.afterSave(saved)
                    },
                    noop
                  );
              }}
            />
          </Dialog>
        )
      }
    </ConfigurationContext.Consumer>
  );
  //#endregion
}
