import { isEmpty, xor } from "lodash";
import * as React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { RendererConfigurationDto } from "../../../../../../common/dto";
import { CardSetViewmodel, MtgCardListViewmodel } from "../../../../viewmodels";
import { CardView } from "../../../common/card-view/card-view";
import { ConfigurationContext } from "../../../context";
import { CenterPanel, CenterPanelProps } from "./center-panel";
import { LeftPanel } from "./left-panel";
import { MtgViewProps } from "./mtg-view.props";
import { MtgViewState } from "./mtg-view.state";

const CenterPanelMemo = React.memo(
  CenterPanel,
  (prev: CenterPanelProps, next: CenterPanelProps) => {
    return prev.selectedSets != null && next.selectedSets != null &&
      isEmpty(xor(
        prev.selectedSets.map((vm: CardSetViewmodel) => vm.id),
        next.selectedSets.map((vm: CardSetViewmodel) => vm.id)
      ));
  }
);

export function MtgView(props: MtgViewProps) {
  //#region State -------------------------------------------------------------
  const initialState: MtgViewState = {};
  const [state, setState] = React.useState(initialState);
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
                  onSetsSelected={(sets: Array<CardSetViewmodel>) => setState({ selectedSets: sets })}
                  onSynchronizeSet={props.onSynchronizeSet}
                />
              </Panel>
              <PanelResizeHandle />
              <Panel>
                <CenterPanelMemo
                  onCardsSelected={(cards?: Array<MtgCardListViewmodel>) => setState({ selectedCards: cards, selectedSets: state.selectedSets })}
                  selectedSets={state.selectedSets}
                />
              </Panel>
              <PanelResizeHandle />
              <Panel defaultSize={20}>
                <CardView
                  cardId={state.selectedCards ? calculateCardToDisplay() : null}
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
    return state.selectedCards[0].otherCardLanguages.at(0).id;
  }
  //#endregion
}
