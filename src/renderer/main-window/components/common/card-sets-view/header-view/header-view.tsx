import { Button, ButtonGroup, IconName, InputGroup, Menu, MenuDivider, MenuItem, Popover } from "@blueprintjs/core";
import * as React from "react";

import { CardSetType } from "../../../../../../common/enums";
import { CardSetGroupBy, CardSetSort } from "../../../../viewmodels";
import { HeaderViewProps } from "./header-view-props";

type PopoverKey = "card-set-group-by-menu" | "card-set-sort-menu" | "card-set-type-filter-menu";

export function HeaderView(props: HeaderViewProps) {
  console.log("Headerview function");

  //#region State -------------------------------------------------------------
  const [textFilterValue, setTextFilterValue] = React.useState<string>(null);
  //#endregion

  //#region Event handling ----------------------------------------------------
  const handleTextFilterChanged = React.useCallback(
    (event: React.FormEvent<HTMLElement>) => {
      setTextFilterValue((event.target as HTMLInputElement).value);
    },
    []
  );

  const handleCardSetSortItemClick = React.useCallback(
    (value: CardSetSort) => props.onCardSetSortChanged(value),
    []
  );

  const handleCardSetGroupByItemClick = React.useCallback(
    (value: CardSetGroupBy) => props.onCardSetGroupByChanged(value),
    []
  );

  const handleCardSetTypeFilterItemClick = React.useCallback(
    (value: CardSetType) => props.onCardSetTypeFilterChanged(value),
    []
  );
  //#endregion

  //#region Effects -----------------------------------------------------------
  React.useEffect(
    () => {
      // null is the initial value and should not trigger anything
      if (textFilterValue != null) {
        const timeOutId = setTimeout(() => props.onTextFilterChanged(textFilterValue), 500);
        return () => clearTimeout(timeOutId);
      }
    },
    [textFilterValue]
  );
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <ButtonGroup minimal={true} fill={true}>
      <InputGroup
        leftIcon="filter"
        onChange={handleTextFilterChanged}
        placeholder="Text Filter..."
        fill={true}
      />
      {
        buildPopover("card-set-group-by-menu", "diagram-tree")
      }
      {
        buildPopover("card-set-sort-menu", "sort")
      }
      {
        buildPopover("card-set-type-filter-menu", "filter-list")
      }
    </ButtonGroup>
  );
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  function buildPopover(key: PopoverKey, icon: IconName): React.JSX.Element {
    return (
      <Popover key={key}
        canEscapeKeyClose={true}
        inheritDarkTheme={true}
        interactionKind="hover"
        minimal={false}
        modifiers={
          { arrow: { enabled: false } }
        }
        content={buildMenu(key)}
        openOnTargetFocus={false}
        placement="bottom-end"
        usePortal={false}>
        <Button icon={icon} />
      </Popover>
    );
  }

  function buildMenu(key: PopoverKey): React.JSX.Element {
    switch (key) {
      case "card-set-group-by-menu":
        return buildGroupByMenu();
      case "card-set-sort-menu":
        return buildSortMenu();
      case "card-set-type-filter-menu":
        return buildTypeFilterMenu();
      default:
        break;
    }
  }

  function buildGroupByMenu(): React.JSX.Element {
    return (
      <Menu small={true}>
        <MenuItem text="Parent" selected={props.cardSetGroupBy == "parent"} roleStructure="listoption" onClick={() => handleCardSetGroupByItemClick("parent")} />
        <MenuItem text="Block" selected={props.cardSetGroupBy == "block"} roleStructure="listoption" onClick={() => handleCardSetGroupByItemClick("block")} />
        <MenuItem text="Set-type" selected={props.cardSetGroupBy == "setType"} roleStructure="listoption" onClick={() => handleCardSetGroupByItemClick("setType")} />
        <MenuItem text="No grouping (slow!)" selected={props.cardSetGroupBy == "none"} roleStructure="listoption" onClick={() => handleCardSetGroupByItemClick("none")} />
      </Menu>
    );
  }

  function buildSortMenu(): React.JSX.Element {
    return (
      <Menu small={true}>
        <MenuItem text="Release date ascending" selected={props.cardSetSort == "releaseDateAscending"} roleStructure="listoption" onClick={() => handleCardSetSortItemClick("releaseDateAscending")} />
        <MenuItem text="Release date descending" selected={props.cardSetSort == "releaseDateDescending"} roleStructure="listoption" onClick={() => handleCardSetSortItemClick("releaseDateDescending")} />
        <MenuDivider />
        <MenuItem text="Alfabetically ascending" selected={props.cardSetSort == "alphabeticallyAscending"} roleStructure="listoption" onClick={() => handleCardSetSortItemClick("alphabeticallyAscending")} />
        <MenuItem text="Alfabetically descending" selected={props.cardSetSort == "alphabeticallyDescending"} roleStructure="listoption" onClick={() => handleCardSetSortItemClick("alphabeticallyDescending")} />
      </Menu>
    );
  }

  function buildTypeFilterMenu(): React.JSX.Element {
    return (
      <Menu small={true}>
        <MenuItem text="Core set" selected={props.cardSetTypeFilter.get("core")} roleStructure="listoption" onClick={() => handleCardSetTypeFilterItemClick("core")} />
        <MenuItem text="Expansion" selected={props.cardSetTypeFilter.get("expansion")} roleStructure="listoption" onClick={() => handleCardSetTypeFilterItemClick("expansion")} />
        <MenuItem text="Token" selected={props.cardSetTypeFilter.get("token")} roleStructure="listoption" onClick={() => handleCardSetTypeFilterItemClick("token")} />
        <MenuItem text="Starter" selected={props.cardSetTypeFilter.get("starter")} roleStructure="listoption" onClick={() => handleCardSetTypeFilterItemClick("starter")} />
        <MenuItem text="Duel deck" selected={props.cardSetTypeFilter.get("duel_deck")} roleStructure="listoption" onClick={() => handleCardSetTypeFilterItemClick("duel_deck")} />
        <MenuItem text="Promo" selected={props.cardSetTypeFilter.get("promo")} roleStructure="listoption" onClick={() => handleCardSetTypeFilterItemClick("promo")} />
        <MenuItem text="Commander" selected={props.cardSetTypeFilter.get("commander")} roleStructure="listoption" onClick={() => handleCardSetTypeFilterItemClick("commander")} />
        <MenuItem text="Others">
          <MenuItem text="Alchemy" selected={props.cardSetTypeFilter.get("alchemy")} roleStructure="listoption" onClick={() => handleCardSetTypeFilterItemClick("alchemy")} />
          <MenuItem text="Archenemy" selected={props.cardSetTypeFilter.get("archenemy")} roleStructure="listoption" onClick={() => handleCardSetTypeFilterItemClick("archenemy")} />
          <MenuItem text="Arsenal" selected={props.cardSetTypeFilter.get("arsenal")} roleStructure="listoption" onClick={() => handleCardSetTypeFilterItemClick("arsenal")} />
          <MenuItem text="Box" selected={props.cardSetTypeFilter.get("box")} roleStructure="listoption" onClick={() => handleCardSetTypeFilterItemClick("box")} />
          <MenuItem text="Draft innovation" selected={props.cardSetTypeFilter.get("draft_innovation")} roleStructure="listoption" onClick={() => handleCardSetTypeFilterItemClick("draft_innovation")} />
          <MenuItem text="From the vault" selected={props.cardSetTypeFilter.get("from_the_vault")} roleStructure="listoption" onClick={() => handleCardSetTypeFilterItemClick("from_the_vault")} />
          <MenuItem text="Funny" selected={props.cardSetTypeFilter.get("funny")} roleStructure="listoption" onClick={() => handleCardSetTypeFilterItemClick("funny")} />
          <MenuItem text="Masterpiece" selected={props.cardSetTypeFilter.get("masterpiece")} roleStructure="listoption" onClick={() => handleCardSetTypeFilterItemClick("masterpiece")} />
          <MenuItem text="Masters" selected={props.cardSetTypeFilter.get("masters")} roleStructure="listoption" onClick={() => handleCardSetTypeFilterItemClick("masters")} />
          <MenuItem text="Memorabilia" selected={props.cardSetTypeFilter.get("memorabilia")} roleStructure="listoption" onClick={() => handleCardSetTypeFilterItemClick("memorabilia")} />
          <MenuItem text="Minigame" selected={props.cardSetTypeFilter.get("minigame")} roleStructure="listoption" onClick={() => handleCardSetTypeFilterItemClick("minigame")} />
          <MenuItem text="Planechase" selected={props.cardSetTypeFilter.get("planechase")} roleStructure="listoption" onClick={() => handleCardSetTypeFilterItemClick("planechase")} />
          <MenuItem text="Premium deck" selected={props.cardSetTypeFilter.get("premium_deck")} roleStructure="listoption" onClick={() => handleCardSetTypeFilterItemClick("premium_deck")} />
          <MenuItem text="Spellbook" selected={props.cardSetTypeFilter.get("spellbook")} roleStructure="listoption" onClick={() => handleCardSetTypeFilterItemClick("spellbook")} />
          <MenuItem text="Treasure chest" selected={props.cardSetTypeFilter.get("treasure_chest")} roleStructure="listoption" onClick={() => handleCardSetTypeFilterItemClick("treasure_chest")} />
          <MenuItem text="Vanguard" selected={props.cardSetTypeFilter.get("vanguard")} roleStructure="listoption" onClick={() => handleCardSetTypeFilterItemClick("vanguard")} />
        </MenuItem>
      </Menu>
    );
  }

  //#endregion
}
