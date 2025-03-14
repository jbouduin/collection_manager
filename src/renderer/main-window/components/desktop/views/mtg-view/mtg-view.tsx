import * as React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { IRendererConfigurationDto } from "../../../../../../common/dto";
import { CardDetail } from "../../../../../shared/components/card-details";
import { compareClassNameProp } from "../../../../../shared/components/utils";
import { ConfigurationContext } from "../../../../../shared/context";
import { CardSetViewmodel, MtgCardListViewmodel } from "../../../../viewmodels";
import { CenterPanel, CenterPanelProps } from "./center-panel";
import { LeftPanel } from "./left-panel/left-panel";
import { MtgViewProps } from "./mtg-view.props";
import { MtgViewState } from "./mtg-view.state";

const CenterPanelMemo = React.memo(
  CenterPanel,
  (prev: CenterPanelProps, next: CenterPanelProps) => {
    return prev.selectedSet?.id == next.selectedSet?.id &&
      prev.queryString == next.queryString &&
      compareClassNameProp(prev.className, next.className);
  }
);

export function MtgView(props: MtgViewProps) {
  //#region State -------------------------------------------------------------
  const initialState: MtgViewState = {
    selectedSet: null,
    selectedCards: null,
    queryString: null
  };
  const [state, setState] = React.useState(initialState);
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <ConfigurationContext.Consumer>
      {
        (configuration: IRendererConfigurationDto) => (
          <>
            <PanelGroup direction="horizontal">
              <Panel defaultSize={20}>
                <LeftPanel
                  {...props}
                  configuration={configuration.mtgSetTreeViewConfiguration}
                  onSearch={(queryString: string) => setState({queryString: queryString, selectedSet: null, selectedCards: null})}
                  onSetsSelected={(sets: Array<CardSetViewmodel>) => setState({ selectedSet: sets[0], queryString: null, selectedCards: null })}
                />
              </Panel>
              <PanelResizeHandle />
              <Panel>
                <CenterPanelMemo
                  {...props}
                  onCardsSelected={(cards?: Array<MtgCardListViewmodel>) => setState({ selectedCards: cards, selectedSet: state.selectedSet, queryString: state.queryString })}
                  queryString={state.queryString}
                  selectedSet={state.selectedSet}
                />
              </Panel>
              <PanelResizeHandle />
              <Panel defaultSize={20}>
                <CardDetail
                  cardId={state.selectedCards?.length > 0 ? calculateCardToDisplay() : null}
                  className={props.className}
                  collectionId={null}
                  showOtherLanguages={true}
                />
              </Panel>
            </PanelGroup>
          </>
        )
      }
    </ConfigurationContext.Consumer >
  );
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  function calculateCardToDisplay(): string {
    return state.selectedCards[0].languages.at(0).id;
  }
  //#endregion
}
