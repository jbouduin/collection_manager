import { Dialog } from "@blueprintjs/core";
import { noop } from "lodash";
import * as React from "react";
import { IConfigurationDto } from "../../../../../common/dto/";
import { ConfigurationWrapper } from "../../../../shared/components/configuration";
import { IIpcProxyService, IpcProxyServiceContext } from "../../../../shared/context";
import { ConfigurationViewModel } from "../../../../shared/viewmodels";
import { SettingsDialogProps } from "./settings-dialog.props";


export function SettingsDialog(props: SettingsDialogProps) {
  //#region State -----------------------------------------------------------------------
  const [configuration, setConfiguration] = React.useState<ConfigurationViewModel>(null);
  //#endregion

  //#region Context ---------------------------------------------------------------------
  const ipcProxyService = React.useContext<IIpcProxyService>(IpcProxyServiceContext);
  //#endregion

  //#region Effect ----------------------------------------------------------------------
  React.useEffect(
    () => {
      if (props.isOpen) {
        void ipcProxyService
          .getData("/configuration")
          .then(
            (configuration: IConfigurationDto) => setConfiguration(new ConfigurationViewModel(configuration, false)),
            (_r: Error) => setConfiguration(null)
          );
      }
    },
    [props.isOpen]
  );
  //#endregion

  //#region Main ------------------------------------------------------------------------
  return (
    <Dialog
      canEscapeKeyClose={true}
      className={props.className}
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
        onSave={(toSave: IConfigurationDto) => {
          void ipcProxyService
            .putData<IConfigurationDto, IConfigurationDto>("/configuration", toSave)
            .then(
              (saved: IConfigurationDto) => props.afterSave(saved),
              noop
            );
        }}
      />
    </Dialog>
  );
  //#endregion
}
