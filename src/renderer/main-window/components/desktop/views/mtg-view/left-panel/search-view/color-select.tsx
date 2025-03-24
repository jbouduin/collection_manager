import { FormGroup, MenuItem } from "@blueprintjs/core";
import { ItemRendererProps, MultiSelect } from "@blueprintjs/select";
import * as React from "react";
import { IColorDto } from "../../../../../../../../common/dto";
import { CardSymbolRenderer } from "../../../../../../../shared/components/card-symbol-renderer";
import { highlightText } from "../../../../../../../shared/components/utils";
import { ColorSelectProps } from "./color-select.props ";


export function ColorSelect(props: ColorSelectProps) {
  //#region Event handling ----------------------------------------------------
  function onClear(): void {
    props.onClearOptions();
  }

  function onRemove(item: IColorDto): void {
    props.onOptionRemoved(item);
  }

  function onSelect(item: IColorDto): void {
    const indexOfSelected = props.selectedColors.findIndex((value: IColorDto) => value.id == item.id);
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
      key={props.colorType}
      label={props.label}
      labelFor="card-sets-multi-select"
    >
      <MultiSelect<IColorDto>
        initialContent={null}
        itemPredicate={filterColor}
        itemRenderer={(item: IColorDto, itemProps: ItemRendererProps) => colorItemRenderer(item, itemProps)}
        items={props.allColors}
        // itemsEqual="id"
        key="card-sets-multi-select"
        noResults={<MenuItem disabled={true} roleStructure="listoption" text="No results." />}
        onClear={() => onClear()}
        onItemSelect={(item: IColorDto) => onSelect(item)}
        onRemove={(item: IColorDto) => onRemove(item)}
        popoverProps={{ matchTargetWidth: true, minimal: true }}
        resetOnSelect={true}
        selectedItems={props.selectedColors}
        tagRenderer={(item: IColorDto) => colorTagRenderer(item)}
      />
    </FormGroup>
  );

  function colorItemRenderer(item: IColorDto, itemProps: ItemRendererProps): React.JSX.Element | null {
    if (!itemProps.modifiers.matchesPredicate) {
      return null;
    }
    return (
      <MenuItem
        active={itemProps.modifiers.active}
        disabled={itemProps.modifiers.disabled}
        key={item.id}
        // labelElement={item.setCode}
        onClick={itemProps.handleClick}
        onFocus={itemProps.handleFocus}
        ref={itemProps.ref}
        roleStructure="listoption"
        selected={props.selectedColors.includes(item)}
        shouldDismissPopover={false}
        text={(
          <div style={{ display: "flex" }}>
            <CardSymbolRenderer cardSymbols={[item.mana_symbol]} className="mana-cost-image-in-text" />
            {highlightText(item.display_text, itemProps.query)}
          </div>
        )}
      />
    );
  }

  function colorTagRenderer(item: IColorDto): React.ReactNode {
    return (
      <div key={item.id}>
        <CardSymbolRenderer cardSymbols={[item.mana_symbol]} />
      </div>
    );
  }
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  function filterColor(query: string, item: IColorDto, index?: number, exactMatch?: boolean): boolean {
    const normalizedTitle = item.display_text.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    } else {
      return normalizedTitle.indexOf(normalizedQuery) >= 0;
    }
  }
  //#endregion
}
