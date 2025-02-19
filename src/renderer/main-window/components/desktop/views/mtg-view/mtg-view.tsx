import * as React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { RendererConfigurationDto } from "../../../../../../common/dto";
import { CardSetViewmodel, MtgCardListViewmodel } from "../../../../viewmodels";
import { CardView } from "../../../common/card-view/card-view";
import { ConfigurationContext } from "../../../context";
import { CenterPanel } from "./center-panel/center-panel";
import { MtgViewProps } from "./mtg-view.props";
import { MtgViewState } from "./mtg-view.state";
import { LeftPanel } from "./left-panel/left-panel";


export function MtgView(props: MtgViewProps) {
  //#region State -------------------------------------------------------------
  const initialState: MtgViewState = {};
  const [state, setState] = React.useState(initialState);
  //#endregion

  //#region Event handlers ----------------------------------------------------
  function onCardSetsSelected(sets: Array<CardSetViewmodel>): void {
    setState({ selectedSets: sets });
  }

  function onCardSelected(cards?: Array<MtgCardListViewmodel>): void {
    setState({ selectedCards: cards, selectedSets: state.selectedSets });
  }
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <ConfigurationContext.Consumer>
      {
        (configuration: RendererConfigurationDto) => (
          <>
            <PanelGroup direction="horizontal">
              <Panel defaultSize={20}>
                <LeftPanel
                  configuration={configuration.databaseViewTreeConfiguration}
                  onCardSetDialog={props.onCardSetDialog}
                  onSetsSelected={onCardSetsSelected}
                  onSynchronizeSet={props.onSynchronizeSet}
                />
              </Panel>
              <PanelResizeHandle />
              <Panel>
                <CenterPanel
                  onCardsSelected={onCardSelected}
                  selectedSets={state.selectedSets}
                />
              </Panel>
              <PanelResizeHandle />
              <Panel defaultSize={20}>
                <CardView
                  cardId={state.selectedCards ? calculateCardToDisplay() : null}
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
    return state.selectedCards[0].otherCardLanguages.at(0).id;
  }
  //#endregion
}
