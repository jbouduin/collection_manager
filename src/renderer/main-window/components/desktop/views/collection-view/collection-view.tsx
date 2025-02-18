import * as React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { RendererConfigurationDto } from "../../../../../../common/dto";
import { CollectionTreeViewmodel, CollectionCardListViewmodel } from "../../../../viewmodels";
import { ConfigurationContext } from "../../../context";
import { CollectionViewProps } from "./collection-view.props";
import { LeftPanel } from "./left-panel/left-panel";
import { CollectionViewState } from "./collection-view-state";
import { CenterPanel } from "./center-panel/center-panel";

export function CollectionView(_props: CollectionViewProps) {
  //#region State -------------------------------------------------------------
  const initialState: CollectionViewState = {};
  const [state, setState] = React.useState(initialState);
  //#endregion

  //#region Event handlers ----------------------------------------------------
  function onCollectionSelected(collections: Array<CollectionTreeViewmodel>): void {
    setState({ selectedCollection: collections[0] });
  }

  function onCardSelected(cards?: Array<CollectionCardListViewmodel>): void {
    setState({ selectedCards: cards, selectedCollection: state.selectedCollection });
  }
  //#endregion

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
                <CenterPanel
                  onCardsSelected={onCardSelected}
                  selectedCollection={state.selectedCollection}
                />
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
