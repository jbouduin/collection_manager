import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import * as React from "react";
import { CollectionViewProps } from "./collection-view.props";
import { ConfigurationContext } from "../../../context";
import { RendererConfigurationDto } from "../../../../../../common/dto";
import { LeftPanel } from "./left-panel/left-panel";
import { CollectionViewmodel } from "../../../../viewmodels/collection/collection.viewmodel";

export function CollectionView(_props: CollectionViewProps) {
  function onCollectionSelected(_collections: Array<CollectionViewmodel>): void {
    /* eslint-disable-next-line no-console */
    console.log("not implemented");
  }

  //#region Main --------------------------------------------------------------
  return (
    <ConfigurationContext.Consumer>
      {
        (_configuration: RendererConfigurationDto) => (
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
