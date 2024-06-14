import { Classes, Dialog } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";

import { SplashContent } from "../../../../common/components/splash/splash-contents";
import { BaseDialogProps } from "../../../../common/components/base-dialog-props";
import { ConfigurationContext } from "../../context";
import { DtoRendererConfiguration } from "../../../../..//common/dto";

export function SplashScreen(props: BaseDialogProps) {
  window.ipc.onEndProgress(() => {
    props.onDialogClose();
  });

  return (
    <>
      {
        <ConfigurationContext.Consumer>
          {
            (configuration: DtoRendererConfiguration) => (
              <Dialog
                isOpen={props.isOpen}
                enforceFocus={true}
                canEscapeKeyClose={true}
                canOutsideClickClose={false}
                className={classNames(configuration.useDarkTheme ? Classes.DARK : "", "splash-window")}
                shouldReturnFocusOnClose={true}
                onClose={props.onDialogClose}
              >
                <SplashContent />
              </Dialog>
            )
          }
        </ConfigurationContext.Consumer>
      }
    </>
  );
}
