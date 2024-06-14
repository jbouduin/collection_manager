import { cloneDeep } from "lodash";
import * as React from "react";

import { CardSetGroupBy, CardSetSort, CardSetType } from "../../../../../common/enums";
import { CardSetViewmodel } from "../../../viewmodels";
import { CardSetContext } from "../../context";
import { CardSetsViewProps } from "./card-sets-view.props";
import { HeaderView } from "./header-view/header-view";
import { TreeView } from "./tree-view/tree-view";
import { TreeConfigurationViewmodel } from "../../../viewmodels/database-view/tree-configuration.viewmodel";

export function CardSetsView(props: CardSetsViewProps) {

  //#region State -------------------------------------------------------------
  const [state, setState] = React.useState<TreeConfigurationViewmodel>(new TreeConfigurationViewmodel(props.configuration));
  //#endregion

  //#region event handling ----------------------------------------------------
  const onTextFilterChanged = (textFilterValue: string) => {
    const newState = new TreeConfigurationViewmodel(cloneDeep(state.dto));
    newState.cardSetFilterValue = textFilterValue;
    setState(newState);
  };

  const onCardSetSortChanged = (cardSetSort: CardSetSort) => {
    const newState = new TreeConfigurationViewmodel(cloneDeep(state.dto));
    newState.cardSetFilterValue = state.cardSetFilterValue;
    newState.cardSetSort = cardSetSort;
    setState(newState);
  };

  const onCardSetGroupByChanged = (cardSetGroupBy: CardSetGroupBy) => {
    const newState = new TreeConfigurationViewmodel(cloneDeep(state.dto));
    newState.cardSetFilterValue = state.cardSetFilterValue;
    newState.cardSetGroupBy = cardSetGroupBy;
    setState(newState);
  };

  const onCardSetTypeFilterChanged = (cardSetType: CardSetType) => {
    const newState = new TreeConfigurationViewmodel(cloneDeep(state.dto));
    newState.cardSetFilterValue = state.cardSetFilterValue;
    newState.toggleCardSetFilterType(cardSetType);
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
