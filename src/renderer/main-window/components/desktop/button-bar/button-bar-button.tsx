import { Button, Popover, Tooltip } from "@blueprintjs/core";
import * as React from "react";
import { AssetQueryOptions, QueryParam } from "../../../../../common/ipc-params";
import { SvgProvider } from "../../common/svg-provider/svg-provider";
import { EButtonBarButtonType } from "./button-bar-button-type.enum";
import { ButtonBarButtonProps } from "./button-bar-button.props";


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
      void window.ipc.query(param).then((response: string) => setSvg(response));
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
        content={props.menu}
        inheritDarkTheme={true}
        interactionKind="hover"
        minimal={false}
        modifiers={
          { arrow: { enabled: false } }
        }
        openOnTargetFocus={false}
        placement="right"
        usePortal={false}
      >
        <Button>
          <SvgProvider height={30} svg={svg} width={30} />
        </Button>
      </Popover>
    );
  }

  function renderToolTipButton(): React.JSX.Element {
    return (
      <Tooltip
        content={props.tooltip}
        key={props.desktopView}
        openOnTargetFocus={false}
        placement="right"
        usePortal={false}
      >
        <Button onClick={onButtonClick}>
          <SvgProvider height={30} svg={svg} width={30} />
        </Button>
      </Tooltip>
    );
  }
  //#endregion
}
