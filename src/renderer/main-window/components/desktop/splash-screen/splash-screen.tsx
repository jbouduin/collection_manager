import { Classes, Dialog } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";
import { DtoRendererConfiguration } from "../../../../..//common/dto";
import { BaseDialogProps } from "../../../../common/components/base-dialog-props";
import { SplashContent } from "../../../../common/components/splash/splash-contents";
import { ConfigurationContext } from "../../context";

export function SplashScreen(props: BaseDialogProps) {
  window.ipc.onEndProgress(() => {
    props.onDialogClose();
  });

  return (
    <>
      <ConfigurationContext.Consumer>
        {
          (configuration: DtoRendererConfiguration) => (
            <Dialog
              canEscapeKeyClose={true}
              canOutsideClickClose={false}
              className={classNames(configuration.useDarkTheme ? Classes.DARK : "", "splash-window")}
              enforceFocus={true}
              isOpen={props.isOpen}
              onClose={props.onDialogClose}
              shouldReturnFocusOnClose={true}
            >
              <SplashContent />
            </Dialog>
          )
        }
      </ConfigurationContext.Consumer>
    </>
  );
}
