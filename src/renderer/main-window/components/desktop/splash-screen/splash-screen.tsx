import { Dialog } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";

import { SplashContent } from "../../../../common/components/splash/splash-contents";
import { BaseDialogProps } from "../../common/base-dialog-props";
import { ThemeContext } from "../../context";

export function SplashScreen(props: BaseDialogProps) {
  return (
    <>
      {

        <ThemeContext.Consumer>
          {
            (theme: string) => (
              <Dialog
                isOpen={props.isOpen}
                enforceFocus={true}
                canEscapeKeyClose={true}
                canOutsideClickClose={false}
                className={classNames(theme, "splash-window")}
                shouldReturnFocusOnClose={true}
                onClose={props.onDialogClose}
              >
                <SplashContent/>
              </Dialog>
            )
          }
        </ThemeContext.Consumer>
      }
    </>
  );
}
