import { Button, Popover, Tooltip } from "@blueprintjs/core";
import * as React from "react";

import { ButtonBarButtonProps } from "./button-bar-button.props";
import { AssetQueryOptions, QueryParam } from "../../../../../common/ipc-params";
import { SvgProvider } from "../../common/svg-provider/svg-provider";
import { EButtonBarButtonType } from "./button-bar-button-type.enum";


export function ButtonBarButton(props: ButtonBarButtonProps) {

  //#region State -------------------------------------------------------------
  const [svg, setSvg] = React.useState<string>(undefined);
  //#endregion

  //#region Event handling ----------------------------------------------------
  function onButtonClick(): void {
    props.onButtonClick(props.desktopView);
  }
  //#endregion

  //#region Effect ------------------------------------------------------------
  React.useEffect(
    () => {
      const param: QueryParam<AssetQueryOptions> = {
        type: "Asset",
        options: {
          path: props.assetPath
        }
      };
      window.ipc.query(param).then((response: string) => setSvg(response));
    },
    [props.assetPath]
  );
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <>
      {
        svg && renderButton()
      }
    </>
  );
  //#endregion

  //#region Auxiliary render methods ------------------------------------------
  function renderButton(): React.JSX.Element {
    if (props.buttonType == EButtonBarButtonType.TooltipButton) {
      return renderToolTipButton();
    } else {
      return renderMenuButton();
    }
  }

  function renderMenuButton(): React.JSX.Element {
    return (
      <Popover
        canEscapeKeyClose={true}
        inheritDarkTheme={true}
        interactionKind="hover"
        minimal={false}
        modifiers={
          { arrow: { enabled: false } }
        }
        content={props.menu}
        openOnTargetFocus={false}
        placement="right"
        usePortal={false}>
        <Button>
          <SvgProvider svg={svg} width={30} height={30} />
        </Button>
      </Popover>
    );
  }

  function renderToolTipButton(): React.JSX.Element {
    return (
      <Tooltip
        key={props.desktopView}
        content={props.tooltip}
        openOnTargetFocus={false}
        placement="right"
        usePortal={false}>
        <Button onClick={onButtonClick}>
          <SvgProvider svg={svg} width={30} height={30} />
        </Button>
      </Tooltip>
    );
  }
  //#endregion
}
