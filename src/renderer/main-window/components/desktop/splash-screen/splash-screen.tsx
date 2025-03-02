import { Classes, Dialog } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";
import { RendererConfigurationDto } from "../../../../..//common/dto";
import { BaseDialogProps } from "../../../../common/components/base-dialog-props";
import { SplashContent } from "../../../../common/components/splash/splash-contents";
import { ConfigurationContext } from "../../context";

export function SplashScreen(props: BaseDialogProps) {
  return (
    <>
      <ConfigurationContext.Consumer>
        {
          (configuration: RendererConfigurationDto) => (
            <Dialog
              canEscapeKeyClose={true}
              canOutsideClickClose={false}
              // TODO pass classname using the props
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
