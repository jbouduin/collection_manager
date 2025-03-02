import { Dialog } from "@blueprintjs/core";
import { noop } from "lodash";
import * as React from "react";
import { ConfigurationDto } from "../../../../../common/dto/";
import { ConfigurationWrapper } from "../../../../common/components/configuration/configuration-wrapper/configuration-wrapper";
import { IpcProxyService, IpcProxyServiceContext } from "../../../../common/context";
import { ConfigurationViewModel } from "../../../../common/viewmodels";
import { SettingsDialogProps } from "./settings-dialog.props";


export function SettingsDialog(props: SettingsDialogProps) {
  //#region State -----------------------------------------------------------------------
  const [configuration, setConfiguration] = React.useState<ConfigurationViewModel>(null);
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
          .then(
            (configuration: ConfigurationDto) => setConfiguration(new ConfigurationViewModel(configuration, false)),
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
        onSave={(toSave: ConfigurationDto) => {
          void ipcProxyService
            .putData<ConfigurationDto, ConfigurationDto>("/configuration", toSave)
            .then(
              (saved: ConfigurationDto) => props.afterSave(saved),
              noop
            );
        }}
      />
    </Dialog>
  );
  //#endregion
}
