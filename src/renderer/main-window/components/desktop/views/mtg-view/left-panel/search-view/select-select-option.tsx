import * as React from "react";
import { SelectSelectOptionProps } from "./select-select-option.props";
import { SelectOption } from "../../../../../../../common/utils";
import { ItemRendererProps, MultiSelect } from "@blueprintjs/select";
import { FormGroup, MenuItem } from "@blueprintjs/core";
import { highlightText } from "../../../../../../../common/components/highlight-text";
import { cloneDeep } from "lodash";

export function SelectSelectOption<T extends string>(props: SelectSelectOptionProps<T>) {
  //#region State -------------------------------------------------------------
  const initialState = props.selectedItems.map((id: T) => props.items.find((f: SelectOption<T>) => f.value == id));
  const [state, setState] = React.useState(initialState);
  //#endregion

  //#region Event handling ----------------------------------------------------
  function onClear(): void {
    props.onClearOptions();
    setState(new Array<SelectOption<T>>());
  }

  function onRemove(item: SelectOption<T>): void {
    const newState = cloneDeep(state);
    const indexOfSelected = newState.findIndex((value: SelectOption<T>) => value.value == item.value);
    newState.splice(indexOfSelected, 1);
    props.onOptionRemoved(item.value);
    setState(newState);
  }

  function onSelect(item: SelectOption<T>): void {
    const newState = cloneDeep(state);
    const indexOfSelected = newState.findIndex((value: SelectOption<T>) => value.value == item.value);
    if (indexOfSelected >= 0) {
      newState.splice(indexOfSelected, 1);
      props.onOptionRemoved(item.value);
    } else {
      newState.push(item);
      props.onOptionAdded(item.value);
    }
    setState(newState);
  }
  //#endregion

  //#region Rendering ---------------------------------------------------------
  return (
    <FormGroup
      key={props.label}
      label={props.label}
    >
      <MultiSelect<SelectOption<T>>
        initialContent={null}
        itemPredicate={filterOption}
        itemRenderer={(item: SelectOption<T>, itemProps: ItemRendererProps) => itemRenderer(item, itemProps)}
        items={props.items}
        key={props.label}
        noResults={<MenuItem disabled={true} roleStructure="listoption" text="No results." />}
        onClear={() => onClear()}
        onItemSelect={(item: SelectOption<T>) => onSelect(item)}
        onRemove={(item: SelectOption<T>) => onRemove(item)}
        popoverProps={{ matchTargetWidth: true, minimal: true }}
        resetOnSelect={true}
        selectedItems={state}
        tagRenderer={(item: SelectOption<T>) => tagRenderer(item)}
      />
    </FormGroup>
  );

  function itemRenderer(item: SelectOption<T>, itemProps: ItemRendererProps): React.JSX.Element | null {
    if (!itemProps.modifiers.matchesPredicate) {
      return null;
    }
    return (
      <MenuItem
        active={itemProps.modifiers.active}
        disabled={itemProps.modifiers.disabled}
        key={item.value}
        onClick={itemProps.handleClick}
        onFocus={itemProps.handleFocus}
        ref={itemProps.ref}
        roleStructure="listoption"
        selected={props.selectedItems.includes(item.value)}
        shouldDismissPopover={false}
        text={(
          <div>
            {highlightText(item.label, itemProps.query)}
          </div>
        )}
      />
    );
  }

  function tagRenderer(item: SelectOption<T>): React.ReactNode {
    return (
      <div key={item.value}>
        {item.label}
      </div>
    );
  }
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  function filterOption(query: string, item: SelectOption<T>, index?: number, exactMatch?: boolean): boolean {
    const normalizedTitle = item.label.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    } else {
      return normalizedTitle.indexOf(normalizedQuery) >= 0;
    }
  }
  //#endregion
}
