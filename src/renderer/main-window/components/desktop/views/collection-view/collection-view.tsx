import { isEqual } from "lodash";
import * as React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { RendererConfigurationDto } from "../../../../../../common/dto";
import { compareClassNameProp } from "../../../../../shared/components";
import { ConfigurationContext } from "../../../../../shared/context";
import { CollectionCardListViewmodel, CollectionTreeViewmodel } from "../../../../viewmodels";
import { CardView } from "../../../common/card-view/card-view";
import { CenterPanel, CenterPanelProps } from "./center-panel";
import { CollectionViewState } from "./collection-view-state";
import { CollectionViewProps } from "./collection-view.props";
import { LeftPanel } from "./left-panel/left-panel";

const CenterPanelMemo = React.memo(
  CenterPanel,
  (prev: CenterPanelProps, next: CenterPanelProps) => {
    return isEqual(prev.selectedCollection, next.selectedCollection) && compareClassNameProp(prev.className, next.className);
  }
);

export function CollectionView(props: CollectionViewProps) {
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
                  {...props}
                  onCollectionSelected={onCollectionSelected}
                />
              </Panel>
              <PanelResizeHandle />
              <Panel>
                <CenterPanelMemo
                  {...props}
                  onCardsSelected={onCardSelected}
                  selectedCollection={state.selectedCollection}
                />
              </Panel>
              <PanelResizeHandle />
              <Panel defaultSize={20}>
                <CardView
                  {...props}
                  cardId={state.selectedCards?.length > 0 ? state.selectedCards[0].cardId : null}
                  collectionId={state.selectedCollection?.id}
                  showOtherLanguages={false}
                />
              </Panel>
            </PanelGroup>
          </>
        )
      }
    </ConfigurationContext.Consumer >
  );
  //#endregion
}
