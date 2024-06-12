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
  const [state, setState] = React.useState<CardSetsViewState>({
    cardSetFilterValue: null,
    cardSetSort: props.defaultCardSetSort,
    cardSetGroupBy: props.defaultCardSetGroupBy,
    cardSetTypeFilter: props.defaultCardSetTypeFilter
  });
  //#endregion

  //#region event handling ----------------------------------------------------
  const onTextFilterChanged = (textFilterValue: string) => {
    const newState = cloneDeep(state);
    newState.cardSetFilterValue = textFilterValue;
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
              textFilter={state.cardSetFilterValue}
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
