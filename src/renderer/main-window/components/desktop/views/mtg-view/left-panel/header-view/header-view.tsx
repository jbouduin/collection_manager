import { Button, ButtonGroup, IconName, InputGroup, Menu, MenuDivider, MenuItem, Popover } from "@blueprintjs/core";
import { isEmpty, xor } from "lodash";
import * as React from "react";
import { CardSetType } from "../../../../../../../../common/types";
import { DisplayValueService, DisplayValueServiceContext } from "../../../../../../../shared/context";
import { compareClassNameProp } from "../../../../../../../shared/components";
import { HeaderViewProps } from "./header-view-props";

type PopoverKey = "card-set-group-by-menu" | "card-set-sort-menu" | "card-set-type-filter-menu";

function headerView(props: HeaderViewProps) {
  //#region State -------------------------------------------------------------
  const [textFilterValue, setTextFilterValue] = React.useState<string>(null);
  //#endregion

  //#region Context -----------------------------------------------------------
  const displayValueService = React.useContext<DisplayValueService>(DisplayValueServiceContext);
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
    <ButtonGroup className="left-panel-button-group" fill={true} minimal={true} >
      <InputGroup
        fill={true}
        leftIcon="filter"
        onChange={handleTextFilterChanged}
        placeholder="Text Filter..."
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
      <Popover
        canEscapeKeyClose={true}
        content={buildMenu(key)}
        inheritDarkTheme={true}
        interactionKind="hover"
        key={key}
        minimal={false}
        modifiers={
          { arrow: { enabled: false } }
        }
        openOnTargetFocus={false}
        placement="bottom-end"
        usePortal={false}
      >
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
        <MenuItem
          onClick={() => props.onCardSetGroupByChanged("parent")}
          roleStructure="listoption"
          selected={props.cardSetGroupBy == "parent"}
          text="Parent"
        />
        <MenuItem
          onClick={() => props.onCardSetGroupByChanged("block")}
          roleStructure="listoption"
          selected={props.cardSetGroupBy == "block"}
          text="Block"
        />
        <MenuItem
          onClick={() => props.onCardSetGroupByChanged("setType")}
          roleStructure="listoption"
          selected={props.cardSetGroupBy == "setType"}
          text="Set-type"
        />
        <MenuItem
          onClick={() => props.onCardSetGroupByChanged("none")}
          roleStructure="listoption"
          selected={props.cardSetGroupBy == "none"}
          text="No grouping (slow!)"
        />
      </Menu>
    );
  }

  function buildSortMenu(): React.JSX.Element {
    return (
      <Menu small={true}>
        <MenuItem
          onClick={() => props.onCardSetSortChanged("releaseDateAscending")}
          roleStructure="listoption"
          selected={props.cardSetSort == "releaseDateAscending"}
          text="Release date ascending"
        />
        <MenuItem
          onClick={() => props.onCardSetSortChanged("releaseDateDescending")}
          roleStructure="listoption"
          selected={props.cardSetSort == "releaseDateDescending"}
          text="Release date descending"
        />
        <MenuDivider />
        <MenuItem
          onClick={() => props.onCardSetSortChanged("alphabeticallyAscending")}
          roleStructure="listoption"
          selected={props.cardSetSort == "alphabeticallyAscending"}
          text="Alfabetically ascending"
        />
        <MenuItem
          onClick={() => props.onCardSetSortChanged("alphabeticallyDescending")}
          roleStructure="listoption"
          selected={props.cardSetSort == "alphabeticallyDescending"}
          text="Alfabetically descending"
        />
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

  function buildTypeFilterMenuItem(setType: CardSetType): React.JSX.Element {
    return (
      <MenuItem
        onClick={() => props.onCardSetTypeFilterChanged(setType)}
        roleStructure="listoption"
        selected={props.cardSetTypeFilter.indexOf(setType) >= 0}
        text={displayValueService.cardSetTypeDisplayValues[setType]}
      />
    );
  }
  //#endregion
}

/*
 * This is just a test on memoization
 * probably not a big gain for the heaer view component
 */
export const HeaderView = React.memo(headerView, (prev: HeaderViewProps, next: HeaderViewProps) => {
  return prev.cardSetGroupBy == next.cardSetGroupBy &&
    prev.cardSetSort == next.cardSetSort &&
    isEmpty(xor(prev.cardSetTypeFilter, next.cardSetTypeFilter)) &&
    compareClassNameProp(prev.className, next.className);
});
