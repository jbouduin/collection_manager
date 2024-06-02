import { clone } from "lodash";
import * as React from "react";

import { CardSetType } from "../../../../../common/enums";
import { CardSetGroupBy, CardSetSort } from "../../../viewmodels";
import { CardSetsViewProps } from "./card-sets-view.props";
import { HeaderView } from "./header-view/header-view";
import { TreeView } from "./tree-view/tree-view";

export function CardSetsView(props: CardSetsViewProps) {

  //#region State -------------------------------------------------------------
  const [textFilterValue, setTextFilterValue] = React.useState<string>(null);
  const [cardSetSort, setCardSetSort] = React.useState<CardSetSort>("releaseDateDescending");
  const [cardSetGroupBy, setCardSetGroupBy] = React.useState<CardSetGroupBy>("parent");
  const initialCardSetTypeFilter: Map<CardSetType, boolean> = new Map<CardSetType, boolean>([
    ["core", true],
    ["expansion", true],
    ["token", true],
    ["starter", true],
    ["duel_deck", true],
    ["promo", false],
    ["commander", false],
    ["masters", false],
    ["alchemy", false],
    ["masterpiece", false],
    ["arsenal", false],
    ["from_the_vault", false],
    ["spellbook", false],
    ["premium_deck", false],
    ["draft_innovation", false],
    ["treasure_chest", false],
    ["planechase", false],
    ["archenemy", false],
    ["vanguard", false],
    ["funny", false],
    ["box", false],
    ["memorabilia", false],
    ["minigame", false]
  ]);
  const [cardSetTypeFilter, setCardSetTypFilter] = React.useState<Map<CardSetType, boolean>>(initialCardSetTypeFilter);
  //#endregion

  //#region event handling ----------------------------------------------------
  const onTextFilterChanged = React.useCallback(
    (textFilterValue: string) => setTextFilterValue(textFilterValue),
    []
  );

  const onCardSetSortChanged = React.useCallback(
    (cardSetSort: CardSetSort) => setCardSetSort(cardSetSort),
    []
  );

  const onCardSetGroupByChanged = React.useCallback(
    (cardSetGroupBy: CardSetGroupBy) => setCardSetGroupBy(cardSetGroupBy),
    []
  );

  const onCardSetTypeFilterChanged = React.useCallback(
    (cardSetType: CardSetType) => {
      const newCardSetTypeFilter = clone(cardSetTypeFilter);
      newCardSetTypeFilter.set(cardSetType, !cardSetTypeFilter.get(cardSetType));
      setCardSetTypFilter(newCardSetTypeFilter);
    },
    []
  );
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <div>
      <HeaderView
        cardSetSort={cardSetSort}
        cardSetGroupBy={cardSetGroupBy}
        cardSetTypeFilter={cardSetTypeFilter}
        onCardSetSortChanged={onCardSetSortChanged}
        onCardSetGroupByChanged={onCardSetGroupByChanged}
        onCardSetTypeFilterChanged={onCardSetTypeFilterChanged}
        onTextFilterChanged={onTextFilterChanged}></HeaderView>
      <TreeView cardSets={props.cardSets} onSetsSelected={props.onSetsSelected} textFilter={textFilterValue}></TreeView>
    </div>
  );
  //#endregion
}
