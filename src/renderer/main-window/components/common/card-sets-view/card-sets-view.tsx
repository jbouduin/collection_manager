import { clone } from "lodash";
import * as React from "react";

import { CardSetType } from "../../../../../common/enums";
import { CardSetGroupBy, CardSetSort, CardSetViewmodel } from "../../../viewmodels";
import { CardSetsViewProps } from "./card-sets-view.props";
import { HeaderView } from "./header-view/header-view";
import { TreeView } from "./tree-view/tree-view";
import { CardSetContext } from "../../context";

export function CardSetsView(props: CardSetsViewProps) {
  console.log("in cardsetsview function");

  //#region State -------------------------------------------------------------
  // NOW have this as rendersettings and create a context for rendersettings (instead of theme context)
  const initial: Record<CardSetType, boolean> = {
    "core": true,
    "expansion": true,
    "token": true,
    "starter": true,
    "duel_deck": true,
    "promo":  false,
    "commander": false,
    "masters":  false,
    "alchemy":  false,
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
    "minigame":  false
  };

  // NOW consolidate state
  const [textFilterValue, setTextFilterValue] = React.useState<string>(() => { console.log("passing textFilterValue initiation"); return null; });
  const [cardSetSort, setCardSetSort] = React.useState<CardSetSort>(() => { console.log("passing cardSetSort initiation"); return "releaseDateDescending"; });
  const [cardSetGroupBy, setCardSetGroupBy] = React.useState<CardSetGroupBy>(() => { console.log("passing cardSetGroupBy initiation"); return "parent"; });
  const [cardSetTypeFilter, setCardSetTypeFilter] = React.useState<Record<CardSetType, boolean>>(() => { console.log("passing cardSetTypeFilter initiation"); return initial; });
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
      setCardSetTypeFilter((oldfilter: Record<CardSetType, boolean>) => {
        const newCardSetTypeFilter = clone(oldfilter);
        newCardSetTypeFilter[cardSetType] = !newCardSetTypeFilter[cardSetType];
        return newCardSetTypeFilter;
      });
    },
    []
  );
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <div className="card-set-tree-wrapper">
      <HeaderView
        cardSetSort={cardSetSort}
        cardSetGroupBy={cardSetGroupBy}
        cardSetTypeFilter={cardSetTypeFilter}
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
              textFilter={textFilterValue}
              cardSetGroupBy={cardSetGroupBy}
              cardSetSort={cardSetSort}
              cardSetTypeFilter={cardSetTypeFilter}
            />
          )
        }
      </CardSetContext.Consumer>
    </div>
  );
  //#endregion
}
