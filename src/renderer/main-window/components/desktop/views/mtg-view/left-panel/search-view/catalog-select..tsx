import { FormGroup, MenuItem } from "@blueprintjs/core";
import { ItemRendererProps, MultiSelect } from "@blueprintjs/select";
import { cloneDeep } from "lodash";
import * as React from "react";
import { ICatalogItemDto } from "../../../../../../../../common/dto";
import { highlightText } from "../../../../../../../shared/components/utils";
import { IIpcProxyService, IpcProxyServiceContext } from "../../../../../../../shared/context";
import { CatalogSelectProps } from "./catalog-select.props";

export function CatalogSelect(props: CatalogSelectProps) {
  //#region State -------------------------------------------------------------
  const [state, setState] = React.useState(props.selectedItems);
  const [items, setItems] = React.useState(new Array<ICatalogItemDto>());
  //#endregion

  //#region Context -----------------------------------------------------------
  const ipcProxyService = React.useContext<IIpcProxyService>(IpcProxyServiceContext);
  //#endregion

  //#region Event handling ----------------------------------------------------
  function onClear(): void {
    props.onClearOptions();
    setState(new Array<ICatalogItemDto>());
  }

  function onRemove(item: ICatalogItemDto): void {
    const newState = cloneDeep(state);
    const indexOfSelected = newState.findIndex((f: ICatalogItemDto) => f.item == item.item);
    newState.splice(indexOfSelected, 1);
    props.onOptionRemoved(item);
    setState(newState);
  }

  function onSelect(item: ICatalogItemDto): void {
    const newState = cloneDeep(state);
    const indexOfSelected = newState.findIndex((f: ICatalogItemDto) => f.item == item.item);
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
      <MultiSelect<ICatalogItemDto>
        initialContent={null}
        // itemListPredicate={itemListPredicate}
        itemPredicate={filterOption}
        itemRenderer={(item: ICatalogItemDto, itemProps: ItemRendererProps) => itemRenderer(item, itemProps)}
        items={items}
        key={props.catalog.catalog_name}
        noResults={<MenuItem disabled={true} roleStructure="listoption" text="No results." />}
        onClear={() => onClear()}
        onItemSelect={(item: ICatalogItemDto) => onSelect(item)}
        onQueryChange={onQueryChange}
        onRemove={(item: ICatalogItemDto) => onRemove(item)}
        popoverProps={{ matchTargetWidth: true, minimal: true }}
        resetOnSelect={true}
        selectedItems={state}
        tagRenderer={(item: ICatalogItemDto) => tagRenderer(item)}
      />
    </FormGroup>
  );

  function itemRenderer(item: ICatalogItemDto, itemProps: ItemRendererProps): React.JSX.Element | null {
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

  function tagRenderer(item: ICatalogItemDto): React.ReactNode {
    return (
      <div key={item.item}>
        {item.item}
      </div>
    );
  }
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  function filterOption(query: string, item: ICatalogItemDto, _index?: number, exactMatch?: boolean): boolean {
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
      .getData<Array<ICatalogItemDto>>(`/catalog/${props.catalog.catalog_name}?item=${query}`)
      .then(
        (r: Array<ICatalogItemDto>) => setItems(r),
        (_r: Error) => setItems(new Array<ICatalogItemDto>())
      );
  }
  //#endregion
}
