import * as React from "react";

import { CardSetDialogProps } from "./card-set-dialog.props";
import { Button, Classes, Dialog } from "@blueprintjs/core";
import classNames from "classnames";
import { SvgProvider } from "../../svg-provider/svg-provider";

export function CardSetDialog(props: CardSetDialogProps) {
  console.log("cardsetdialog function")
  //#region main --------------------------------------------------------------
  return (
    <>
      {
        props.cardSet &&
        <Dialog isOpen={props.isOpen} onClose={props.onClose} shouldReturnFocusOnClose={true} canEscapeKeyClose={true} isCloseButtonShown={true} title={buildTitle()} className={Classes.DARK}>

          <p>This is some text</p>
          <div
            className={classNames(Classes.DIALOG_FOOTER, props.className)}
          >
            <Button onClick={props.onClose}>Close</Button>

          </div>
        </Dialog>
      }
    </>
  );
  // #endregion

  //#region Auxiliare methods -------------------------------------------------
  function buildTitle(): React.JSX.Element {
    return (
      <>
        <SvgProvider svg={props.cardSet.cardSetSvg} />
        {props.cardSet.cardSetName}
      </>

    );
  }
  //#endregion
}
