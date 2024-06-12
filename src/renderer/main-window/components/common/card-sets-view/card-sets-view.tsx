import { cloneDeep } from "lodash";
import * as React from "react";

import { CardSetGroupBy, CardSetSort, CardSetType } from "../../../../../common/enums";
import { CardSetViewmodel } from "../../../viewmodels";
import { CardSetContext } from "../../context";
import { CardSetsViewProps } from "./card-sets-view.props";
import { HeaderView } from "./header-view/header-view";
import { TreeView } from "./tree-view/tree-view";
import { CardSetsViewState } from "./card-sets-view.state";

export function CardSetsView(props: CardSetsViewProps) {

  //#region State -------------------------------------------------------------
  // NOW have this as rendersettings and create a context for rendersettings (instead of theme context)
  const initial: CardSetsViewState = {
    textFilterValue: null,
    cardSetSort: "releaseDateDescending",
    cardSetGroupBy: "parent",
    cardSetTypeFilter: {
      "core": true,
      "expansion": true,
      "token": true,
      "starter": true,
      "duel_deck": true,
      "promo": false,
      "commander": false,
      "masters": false,
      "alchemy": false,
      "masterpiece": false,
      "arsenal": false,
      "from_the_vault": false,
      "spellbook": false,
      "premium_deck": false,
      "draft_innovation": false,
      "treasure_chest": false,
      "planechase": false,
      "archenemy": false,
      "vanguard": false,
      "funny": false,
      "box": false,
      "memorabilia": false,
      "minigame": false
    }
  };

  const [state, setState] = React.useState<CardSetsViewState>(() => { console.log("assigning initial state"); return initial; })
  //#endregion

  //#region event handling ----------------------------------------------------
  const onTextFilterChanged = (textFilterValue: string) => {
    const newState = cloneDeep(state);
    newState.textFilterValue = textFilterValue;
    setState(newState);
  };

  const onCardSetSortChanged = (cardSetSort: CardSetSort) => {
    const newState = cloneDeep(state);
    newState.cardSetSort = cardSetSort;
    setState(newState);
  };

  const onCardSetGroupByChanged = (cardSetGroupBy: CardSetGroupBy) => {
    const newState = cloneDeep(state);
    newState.cardSetGroupBy = cardSetGroupBy;
    setState(newState);
  };

  const onCardSetTypeFilterChanged = (cardSetType: CardSetType) => {
    const newState = cloneDeep(state);
    newState.cardSetTypeFilter[cardSetType] = !newState.cardSetTypeFilter[cardSetType];
    setState(newState);
  };
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <div className="card-set-tree-wrapper">
      <HeaderView
        cardSetSort={state.cardSetSort}
        cardSetGroupBy={state.cardSetGroupBy}
        cardSetTypeFilter={state.cardSetTypeFilter}
        onCardSetSortChanged={onCardSetSortChanged}
        onCardSetGroupByChanged={onCardSetGroupByChanged}
        onCardSetTypeFilterChanged={onCardSetTypeFilterChanged}
        onTextFilterChanged={onTextFilterChanged}
      />
      <CardSetContext.Consumer>
        {
          (cardSets: Array<CardSetViewmodel>) => (
            <TreeView
              cardSets={cardSets}
              onSetsSelected={props.onSetsSelected}
              onSynchronizeSet={props.onSynchronizeSet}
              onCardSetDialog={props.onCardSetDialog}
              textFilter={state.textFilterValue}
              cardSetGroupBy={state.cardSetGroupBy}
              cardSetSort={state.cardSetSort}
              cardSetTypeFilter={state.cardSetTypeFilter}
            />
          )
        }
      </CardSetContext.Consumer>
    </div>

  );
  //#endregion
}
