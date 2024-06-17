import { Button, ButtonGroup, IconName, InputGroup, Menu, MenuDivider, MenuItem, Popover } from "@blueprintjs/core";
import * as React from "react";

import { CardSetType, CardSetTypeDisplayValue } from "../../../../../../../../common/enums";
import { HeaderViewProps } from "./header-view-props";

type PopoverKey = "card-set-group-by-menu" | "card-set-sort-menu" | "card-set-type-filter-menu";

export function HeaderView(props: HeaderViewProps) {

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
        <MenuItem text="Parent" selected={props.cardSetGroupBy == "parent"} roleStructure="listoption" onClick={() => props.onCardSetGroupByChanged("parent")} />
        <MenuItem text="Block" selected={props.cardSetGroupBy == "block"} roleStructure="listoption" onClick={() => props.onCardSetGroupByChanged("block")} />
        <MenuItem text="Set-type" selected={props.cardSetGroupBy == "setType"} roleStructure="listoption" onClick={() => props.onCardSetGroupByChanged("setType")} />
        <MenuItem text="No grouping (slow!)" selected={props.cardSetGroupBy == "none"} roleStructure="listoption" onClick={() => props.onCardSetGroupByChanged("none")} />
      </Menu>
    );
  }

  function buildSortMenu(): React.JSX.Element {
    return (
      <Menu small={true}>
        <MenuItem text="Release date ascending" selected={props.cardSetSort == "releaseDateAscending"} roleStructure="listoption" onClick={() => props.onCardSetSortChanged("releaseDateAscending")} />
        <MenuItem text="Release date descending" selected={props.cardSetSort == "releaseDateDescending"} roleStructure="listoption" onClick={() => props.onCardSetSortChanged("releaseDateDescending")} />
        <MenuDivider />
        <MenuItem text="Alfabetically ascending" selected={props.cardSetSort == "alphabeticallyAscending"} roleStructure="listoption" onClick={() => props.onCardSetSortChanged("alphabeticallyAscending")} />
        <MenuItem text="Alfabetically descending" selected={props.cardSetSort == "alphabeticallyDescending"} roleStructure="listoption" onClick={() => props.onCardSetSortChanged("alphabeticallyDescending")} />
      </Menu>
    );
  }

  function buildTypeFilterMenu(): React.JSX.Element {
    return (
      <Menu small={true}>
        {buildTypeFilterMenuItem("core")}
        {buildTypeFilterMenuItem("expansion")}
        {buildTypeFilterMenuItem("token")}
        {buildTypeFilterMenuItem("starter")}
        {buildTypeFilterMenuItem("duel_deck")}
        {buildTypeFilterMenuItem("promo")}
        {buildTypeFilterMenuItem("commander")}
        <MenuItem text="Others">
          {buildTypeFilterMenuItem("alchemy")}
          {buildTypeFilterMenuItem("archenemy")}
          {buildTypeFilterMenuItem("arsenal")}
          {buildTypeFilterMenuItem("box")}
          {buildTypeFilterMenuItem("draft_innovation")}
          {buildTypeFilterMenuItem("from_the_vault")}
          {buildTypeFilterMenuItem("funny")}
          {buildTypeFilterMenuItem("masterpiece")}
          {buildTypeFilterMenuItem("masters")}
          {buildTypeFilterMenuItem("memorabilia")}
          {buildTypeFilterMenuItem("minigame")}
          {buildTypeFilterMenuItem("planechase")}
          {buildTypeFilterMenuItem("premium_deck")}
          {buildTypeFilterMenuItem("spellbook")}
          {buildTypeFilterMenuItem("treasure_chest")}
          {buildTypeFilterMenuItem("vanguard")}
        </MenuItem>
      </Menu>
    );
  }

  function buildTypeFilterMenuItem(setType: CardSetType): React.JSX.Element{
    return(
      <MenuItem
        text={CardSetTypeDisplayValue.get(setType)}
        selected={props.cardSetTypeFilter.indexOf(setType) >= 0} roleStructure="listoption"
        onClick={() => props.onCardSetTypeFilterChanged(setType)} />
    );
  }
  //#endregion
}
