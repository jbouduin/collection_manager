import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Button, Card } from "@blueprintjs/core";
import * as React from "react";

import { CollectionViewProps } from "./collection-view.props";
import { ConfigurationContext } from "../../../context";
import { DtoRendererConfiguration } from "../../../../../../common/dto";

export function CollectionView(props: CollectionViewProps) {

  //#region Main --------------------------------------------------------------
  return (
    <ConfigurationContext.Consumer>
      {
        (configuration: DtoRendererConfiguration) => (
          <>
            <PanelGroup direction="horizontal">
              <Panel defaultSize={20}>
                Left
              </Panel>
              <PanelResizeHandle />
              <Panel>
                Mid
              </Panel>
              <PanelResizeHandle />
              <Panel defaultSize={20}>
                Right
              </Panel>
            </PanelGroup>
          </>
        )
      }
    </ConfigurationContext.Consumer >
  );
  //#endregion
 }
