import { FormGroup, MenuItem } from "@blueprintjs/core";
import { ItemRendererProps, MultiSelect } from "@blueprintjs/select";
import { cloneDeep } from "lodash";
import * as React from "react";
import { CatalogItemDto } from "../../../../../../../../common/dto";
import { highlightText } from "../../../../../../../common/components/highlight-text";
import { CatalogSelectProps } from "./catalog-select.props";
import { IpcProxyService, IpcProxyServiceContext } from "../../../../../../../common/context";

export function CatalogSelect(props: CatalogSelectProps) {
  //#region State -------------------------------------------------------------
  const [state, setState] = React.useState(props.selectedItems);
  const [items, setItems] = React.useState(new Array<CatalogItemDto>());
  //#endregion

  //#region Context -----------------------------------------------------------
  const ipcProxyService = React.useContext<IpcProxyService>(IpcProxyServiceContext);
  //#endregion

  //#region Event handling ----------------------------------------------------
  function onClear(): void {
    props.onClearOptions();
    setState(new Array<CatalogItemDto>());
  }

  function onRemove(item: CatalogItemDto): void {
    const newState = cloneDeep(state);
    const indexOfSelected = newState.findIndex((f: CatalogItemDto) => f.item == item.item);
    newState.splice(indexOfSelected, 1);
    props.onOptionRemoved(item);
    setState(newState);
  }

  function onSelect(item: CatalogItemDto): void {
    const newState = cloneDeep(state);
    const indexOfSelected = newState.findIndex((f: CatalogItemDto) => f.item == item.item);
    if (indexOfSelected >= 0) {
      newState.splice(indexOfSelected, 1);
      props.onOptionRemoved(item);
    } else {
      newState.push(item);
      props.onOptionAdded(item);
    }
    setState(newState);
  }
  //#endregion

  //#region Rendering ---------------------------------------------------------
  return (
    <FormGroup
      key={props.catalog.catalog_name}
      label={props.catalog.display_label}
    >
      <MultiSelect<CatalogItemDto>
        initialContent={null}
        // itemListPredicate={itemListPredicate}
        itemPredicate={filterOption}
        itemRenderer={(item: CatalogItemDto, itemProps: ItemRendererProps) => itemRenderer(item, itemProps)}
        items={items}
        key={props.catalog.catalog_name}
        noResults={<MenuItem disabled={true} roleStructure="listoption" text="No results." />}
        onClear={() => onClear()}
        onItemSelect={(item: CatalogItemDto) => onSelect(item)}
        onQueryChange={onQueryChange}
        onRemove={(item: CatalogItemDto) => onRemove(item)}
        popoverProps={{ matchTargetWidth: true, minimal: true }}
        resetOnSelect={true}
        selectedItems={state}
        tagRenderer={(item: CatalogItemDto) => tagRenderer(item)}
      />
    </FormGroup>
  );

  function itemRenderer(item: CatalogItemDto, itemProps: ItemRendererProps): React.JSX.Element | null {
    if (!itemProps.modifiers.matchesPredicate) {
      return null;
    }
    return (
      <MenuItem
        active={itemProps.modifiers.active}
        disabled={itemProps.modifiers.disabled}
        key={item.item}
        onClick={itemProps.handleClick}
        onFocus={itemProps.handleFocus}
        ref={itemProps.ref}
        roleStructure="listoption"
        selected={props.selectedItems.includes(item)}
        shouldDismissPopover={false}
        text={(
          <div>
            {highlightText(item.item, itemProps.query)}
          </div>
        )}
      />
    );
  }

  function tagRenderer(item: CatalogItemDto): React.ReactNode {
    return (
      <div key={item.item}>
        {item.item}
      </div>
    );
  }
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  function filterOption(query: string, item: CatalogItemDto, _index?: number, exactMatch?: boolean): boolean {
    const normalizedTitle = item.item.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    } else {
      return normalizedTitle.indexOf(normalizedQuery) >= 0;
    }
  }

  function onQueryChange(query: string, _event?: React.ChangeEvent<HTMLInputElement>): void {
    void ipcProxyService
      .getData<Array<CatalogItemDto>>(`/catalog/${props.catalog.catalog_name}?item=${query}`)
      .then(
        (r: Array<CatalogItemDto>) => setItems(r),
        (_r: Error) => setItems(new Array<CatalogItemDto>())
      );
  }
  //#endregion
}
