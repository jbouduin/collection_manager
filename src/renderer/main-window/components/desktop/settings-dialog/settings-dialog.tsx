import { Dialog } from "@blueprintjs/core";
import * as React from "react";
import { ConfigurationView } from "../../../../common/components/configuration/configuration-view";

import { DtoConfiguration } from "../../../../../common/dto/configuration/configuration.dto";
import { QueryParam } from "../../../../../common/ipc-params";
import { FooterView } from "../../../../common/components/configuration/footer-view/footer-view";
import { ConfigurationViewModel } from "../../../../common/viewmodels/configuration/configuration.viewmodel";
import { ThemeContext } from "../../context";
import { SettingsDialogProps } from "./settings-dialog.props";

export function SettingsDialog(props: SettingsDialogProps) {

  //#region State -----------------------------------------------------------------------
  const [configuration, setConfiguration] = React.useState<ConfigurationViewModel>(undefined);
  //#endregion

  //#region Event handling --------------------------------------------------------------
  const onSettingsSave = React.useCallback(
    () => {
      console.log("save ");
    },
    []
  );

  const onSettingsClose = React.useCallback(
    () => props.settingsDialogClose(),
    []
  );
  //#endregion

  //#region Effect ----------------------------------------------------------------------
  React.useEffect(
    () => {
      const queryParam: QueryParam<null> = {
        type: "Configuration",
        options: null
      };
      window.ipc.query(queryParam)
        .then((configuration: DtoConfiguration) => setConfiguration(new ConfigurationViewModel(configuration, false)));
    },
    [props.isOpen]
  );
  //#endregion

  //#region Main ------------------------------------------------------------------------
  return (
    <ThemeContext.Consumer>
      {
        (theme: string) => (
          <Dialog
            isOpen={props.isOpen}
            onClose={onSettingsClose}
            shouldReturnFocusOnClose={true}
            canEscapeKeyClose={true}
            isCloseButtonShown={true}
            title="Settings"
            className={theme}
          >
            <ConfigurationView configuration={configuration} />
            <FooterView onCancel={onSettingsClose} onSave={onSettingsSave} hasChanges={configuration?.hasChanges}></FooterView>
          </Dialog>
        )
      }
    </ThemeContext.Consumer>
  );
  //#endregion
}
