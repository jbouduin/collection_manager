import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Button, Card } from "@blueprintjs/core";
import * as React from "react";

import { CollectionViewProps } from "./collection-view.props";
import { ConfigurationContext } from "../../../context";
import { DtoRendererConfiguration } from "../../../../../../common/dto";
import { LeftPanel } from "./left-panel/left-panel";
import { CollectionViewmodel } from "../../../../viewmodels/collection/collection.viewmodel";

export function CollectionView(props: CollectionViewProps) {

  function onCollectionSelected(collections: Array<CollectionViewmodel>): void {
    console.log("not implemented")
  }

  //#region Main --------------------------------------------------------------
  return (
    <ConfigurationContext.Consumer>
      {
        (configuration: DtoRendererConfiguration) => (
          <>
            <PanelGroup direction="horizontal">
              <Panel defaultSize={20}>
                <LeftPanel
                  onCollectionSelected={onCollectionSelected}
                />
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
