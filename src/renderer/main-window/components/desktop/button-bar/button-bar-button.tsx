import { Button, Tooltip } from "@blueprintjs/core";
import * as React from "react";

import { ButtonBarButtonProps } from "./button-bar-button.props";
import { AssetQueryOptions, QueryParam } from "../../../../../common/ipc-params";
import { SvgProvider } from "../../common/svg-provider/svg-provider";


export function ButtonBarButton(props: ButtonBarButtonProps) {

  const [svg, setSvg] = React.useState<string>(undefined);
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
    <div>
      {svg &&
        <Tooltip
          key={props.desktopView}
          content={props.tooltip}
          openOnTargetFocus={false}
          placement="right"
          usePortal={false}>
          <Button onClick={onButtonClick}>
            <SvgProvider svg={svg} width={30} height={30}/>
          </Button>
        </Tooltip>
      }
    </div>
  );
  //#endregion
}
