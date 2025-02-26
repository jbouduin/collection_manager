import * as React from "react";
import { SearchViewProps } from "./search-view.props";
import { Button, FormGroup, MenuItem, MenuItemProps } from "@blueprintjs/core";
import { CardSearchViewmodel } from "../../../../../../viewmodels/card/card-search.viewmodel";
import { CardSetViewmodel } from "../../../../../../viewmodels";
import { CardSetContext } from "../../../../../context";
import { ItemRendererProps, MultiSelect } from "@blueprintjs/select";
import { cloneDeep } from "lodash";
import { SvgProvider } from "../../../../../common/svg-provider/svg-provider";

export function SearchView(props: SearchViewProps) {
  //#region State -----------------------------------------------------------------------
  const [state, setState] = React.useState<CardSearchViewmodel>(new CardSearchViewmodel());
  //#endregion

  //#region Context ---------------------------------------------------------------------
  const cardSetContext = React.useContext<Array<CardSetViewmodel>>(CardSetContext);
  //#endregion

  //#region Event handling --------------------------------------------------------------
  function onCardSetSelect(item: CardSetViewmodel): void {
    const newState = cloneDeep(state);
    if (newState.selectedSets.includes(item.id)) {
      newState.removeCardSet(item.id);
    } else {
      newState.addCardSet(item.id);
    }
    setState(newState);
  }

  function clearCardSets(): void {
    const newState = cloneDeep(state);
    newState.clearCardSetSelection();
    setState(newState);
  }

  function removeCardSet(item: CardSetViewmodel): void {
    const newState = cloneDeep(state);
    newState.removeCardSet(item.id);
    setState(newState);
  }

  function onClickSearch(): void {
    props.onSearch(state.toQueryString());
  }
  //#endregion

  //#region Rendering ---------------------------------------------------------
  return (
    <>
      <FormGroup
        key="card-sets"
        label="Card Sets"
        labelFor="card-sets-multi-select"
      >
        <MultiSelect<CardSetViewmodel>
          initialContent={null}
          itemPredicate={filterFilm}
          itemRenderer={(item: CardSetViewmodel, itemProps: ItemRendererProps) => cardSetItemRenderer(item, itemProps)}
          items={cardSetContext}
          itemsEqual="id"
          noResults={<MenuItem disabled={true} roleStructure="listoption" text="No results." />}
          onClear={clearCardSets}
          onItemSelect={(item: CardSetViewmodel) => onCardSetSelect(item)}
          onRemove={(item: CardSetViewmodel) => removeCardSet(item)}
          popoverProps={{ matchTargetWidth: true, minimal: true }}
          resetOnSelect={true}
          selectedItems={state.selectedSets.map((id: string) => cardSetContext.find((c: CardSetViewmodel) => c.id == id))}
          tagRenderer={(item: CardSetViewmodel) => tagRenderer(item)}
        />
      </FormGroup>
      <Button
        disabled={!state.hasChanges}
        icon="search"
        onClick={onClickSearch}
      >
        Search
      </Button>
    </>
  );

  function cardSetItemRenderer(item: CardSetViewmodel, itemProps: ItemRendererProps): React.JSX.Element | null {
    if (!itemProps.modifiers.matchesPredicate) {
      return null;
    }
    return (
      <MenuItem
        {...getCardSetItemProps(item, itemProps)}
        roleStructure="listoption"
        selected={state.selectedSets.includes(item.id)}
        shouldDismissPopover={false}
      />
    );
  }

  function tagRenderer(item: CardSetViewmodel): React.ReactNode {
    return (
      <div key={item.id}>
        {item.cardSetName}
      </div>
    );
  }

  function getCardSetItemProps(
    cardSet: CardSetViewmodel,
    { handleClick, handleFocus, modifiers, query, ref }: ItemRendererProps
  ): MenuItemProps & React.Attributes {
    return {
      active: modifiers.active,
      disabled: modifiers.disabled,
      key: cardSet.id,
      label: cardSet.setCode,
      onClick: handleClick,
      onFocus: handleFocus,
      ref,
      text: (
        <div>
          <SvgProvider svg={cardSet.cardSetSvg} />
          {highlightText(cardSet.cardSetName, query)}
        </div>
      )
    };
  }

  function escapeRegExpChars(text: string) {
    /* eslint-disable-next-line no-useless-escape */
    return text.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  }

  function highlightText(text: string, query: string) {
    let lastIndex = 0;
    const words = query
      .split(/\s+/)
      .filter((word: string) => word.length > 0)
      .map(escapeRegExpChars);
    if (words.length === 0) {
      return [text];
    }
    const regexp = new RegExp(words.join("|"), "gi");
    const tokens = new Array<React.ReactNode>();
    let continueSearch = true;
    while (continueSearch) {
      const match = regexp.exec(text);
      if (!match) {
        continueSearch = false;
      } else {
        const length = match[0].length;
        const before = text.slice(lastIndex, regexp.lastIndex - length);
        if (before.length > 0) {
          tokens.push(before);
        }
        lastIndex = regexp.lastIndex;
        tokens.push(<b key={lastIndex}>{match[0]}</b>);
        const rest = text.slice(lastIndex);
        if (rest.length > 0) {
          tokens.push(rest);
        }
      }
    }
    return tokens;
  }

  // NOW see explanation: for cardsets (a long list!) this is probably not performant enough
  function filterFilm(query: string, item: CardSetViewmodel, index?: number, exactMatch?: boolean): boolean {
    const normalizedTitle = item.cardSetName.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    } else {
      return normalizedTitle.indexOf(normalizedQuery) >= 0;
    }
  }
  //#endregion
}
