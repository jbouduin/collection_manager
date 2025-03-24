import { FormGroup, MenuItem } from "@blueprintjs/core";
import { ItemRendererProps, MultiSelect } from "@blueprintjs/select";
import * as React from "react";
import { highlightText, SelectOption } from "../../../../../../../shared/components/utils";
import { SelectSelectOptionProps } from "./select-select-option.props";

export function SelectSelectOption<T extends string>(props: SelectSelectOptionProps<T>) {
  //#region Event handling ----------------------------------------------------
  function onClear(): void {
    props.onClearOptions();
  }

  function onRemove(item: SelectOption<T>): void {
    props.onOptionRemoved(item);
  }

  function onSelect(item: SelectOption<T>): void {
    const indexOfSelected = props.selectedItems.findIndex((value: SelectOption<T>) => value.value == item.value);
    if (indexOfSelected >= 0) {
      props.onOptionRemoved(item);
    } else {
      props.onOptionAdded(item);
    }
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
        items={props.allItems}
        key={props.label}
        noResults={<MenuItem disabled={true} roleStructure="listoption" text="No results." />}
        onClear={() => onClear()}
        onItemSelect={(item: SelectOption<T>) => onSelect(item)}
        onRemove={(item: SelectOption<T>) => onRemove(item)}
        popoverProps={{ matchTargetWidth: true, minimal: true }}
        resetOnSelect={true}
        selectedItems={props.selectedItems}
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
        selected={props.selectedItems.includes(item)}
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
