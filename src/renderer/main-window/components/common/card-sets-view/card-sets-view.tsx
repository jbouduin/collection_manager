import { clone } from "lodash";
import * as React from "react";

import { CardSetType } from "../../../../../common/enums";
import { CardSetGroupBy, CardSetSort } from "../../../viewmodels";
import { CardSetsViewProps } from "./card-sets-view.props";
import { HeaderView } from "./header-view/header-view";
import { TreeView } from "./tree-view/tree-view";

export function CardSetsView(props: CardSetsViewProps) {
  console.log("in cardsetsview function");

  //#region State -------------------------------------------------------------
  const initial: Map<CardSetType, boolean> = new Map<CardSetType, boolean>([
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
  console.log(initial);
  const [textFilterValue, setTextFilterValue] = React.useState<string>(() => { console.log("passing textFilterValue initiation"); return null; });
  const [cardSetSort, setCardSetSort] = React.useState<CardSetSort>(() => { console.log("passing cardSetSort initiation"); return "releaseDateDescending"; });
  const [cardSetGroupBy, setCardSetGroupBy] = React.useState<CardSetGroupBy>(() => { console.log("passing cardSetGroupBy initiation"); return "parent"; });
  const [cardSetTypeFilter, setCardSetTypeFilter] = React.useState<Map<CardSetType, boolean>>(() => { console.log("passing cardSetTypeFilter initiation"); return initial; });
  //#endregion

  //#region event handling ----------------------------------------------------
  const onTextFilterChanged = React.useCallback(
    (textFilterValue: string) => { console.log("onTextFilterChanged", cardSetTypeFilter); setTextFilterValue(textFilterValue); },
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
      setCardSetTypeFilter((oldfilter: Map<CardSetType, boolean>) => {
        const newCardSetTypeFilter = clone(oldfilter);
        newCardSetTypeFilter.set(cardSetType, !newCardSetTypeFilter.get(cardSetType));
        return newCardSetTypeFilter;
      });
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
        onTextFilterChanged={onTextFilterChanged}
      />
      <TreeView
        cardSets={props.cardSets}
        languages={props.languages}
        onSetsSelected={props.onSetsSelected}
        textFilter={textFilterValue}
        cardSetGroupBy={cardSetGroupBy}
        cardSetSort={cardSetSort}
        cardSetTypeFilter={cardSetTypeFilter}
      />
    </div>
  );
  //#endregion
}
