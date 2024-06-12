import { Dialog } from "@blueprintjs/core";
import * as React from "react";

import { DtoConfiguration } from "../../../../../common/dto/configuration/configuration.dto";
import { QueryParam } from "../../../../../common/ipc-params";
import { ConfigurationWrapper } from "../../../../common/components/configuration/configuration-wrapper/configuration-wrapper";
import { ConfigurationViewModel } from "../../../../common/viewmodels/configuration/configuration.viewmodel";
import { BaseDialogProps } from "../../../../common/components/base-dialog-props";
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
      window.ipc.query(queryParam)
        .then((configuration: DtoConfiguration) => setConfiguration(new ConfigurationViewModel(configuration, false)));
    },
    [props.isOpen]
  );
  //#endregion

  //#region Main ------------------------------------------------------------------------
  return (
    <ConfigurationContext.Consumer>
      {
        (theme: string) => (
          <Dialog
            isOpen={props.isOpen}
            onClose={() => props.onDialogClose()}
            shouldReturnFocusOnClose={true}
            canEscapeKeyClose={true}
            isCloseButtonShown={true}
            title="Settings"
            className={theme}
          >
            <ConfigurationWrapper
              configuration={configuration}
              onCancel={() => props.onDialogClose()}
              onSave={() => props.onDialogClose()}/>
          </Dialog>
        )
      }
    </ConfigurationContext.Consumer>
  );
  //#endregion
}
