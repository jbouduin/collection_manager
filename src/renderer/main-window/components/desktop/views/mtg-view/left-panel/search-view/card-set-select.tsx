import { FormGroup, MenuItem } from "@blueprintjs/core";
import { ItemRendererProps, MultiSelect } from "@blueprintjs/select";
import * as React from "react";
import { SvgProvider } from "../../../../../../../shared/components/svg-provider";
import { highlightText } from "../../../../../../../shared/components/utils";
import { CardSetViewmodel } from "../../../../../../viewmodels";
import { CardSetSelectProps } from "./card-set-select.props";


export function CardSetSelect(props: CardSetSelectProps) {
  //#region Event handling ----------------------------------------------------
  function onClear(): void {
    props.onClearOptions();
  }

  function onRemove(item: CardSetViewmodel): void {
    props.onOptionRemoved(item);
  }

  function onSelect(item: CardSetViewmodel): void {
    const indexOfSelected = props.selectedCardSets.findIndex((value: CardSetViewmodel) => value.id == item.id);
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
      key="card-sets"
      label="Card Sets"
      labelFor="card-sets-multi-select"
    >
      <MultiSelect<CardSetViewmodel>
        initialContent={null}
        itemPredicate={filterCardSet}
        itemRenderer={(item: CardSetViewmodel, itemProps: ItemRendererProps) => cardSetItemRenderer(item, itemProps)}
        items={props.allCardSets}
        itemsEqual="id"
        key="card-sets-multi-select"
        noResults={<MenuItem disabled={true} roleStructure="listoption" text="No results." />}
        onClear={() => onClear()}
        onItemSelect={(item: CardSetViewmodel) => onSelect(item)}
        onRemove={(item: CardSetViewmodel) => onRemove(item)}
        popoverProps={{ matchTargetWidth: true, minimal: true }}
        resetOnSelect={true}
        selectedItems={props.selectedCardSets}
        tagRenderer={(item: CardSetViewmodel) => cardSetTagRenderer(item)}
      />
    </FormGroup>
  );

  function cardSetItemRenderer(item: CardSetViewmodel, itemProps: ItemRendererProps): React.JSX.Element | null {
    if (!itemProps.modifiers.matchesPredicate) {
      return null;
    }
    return (
      <MenuItem
        active={itemProps.modifiers.active}
        disabled={itemProps.modifiers.disabled}
        key={item.id}
        label={item.setCode}
        onClick={itemProps.handleClick}
        onFocus={itemProps.handleFocus}
        ref={itemProps.ref}
        roleStructure="listoption"
        selected={props.selectedCardSets.includes(item)}
        shouldDismissPopover={false}
        text={(
          <div>
            <SvgProvider svg={item.cardSetSvg} />
            {highlightText(item.cardSetName, itemProps.query)}
          </div>
        )}
      />
    );
  }

  function cardSetTagRenderer(item: CardSetViewmodel): React.ReactNode {
    return (
      <div key={item.id}>
        <SvgProvider svg={item.cardSetSvg} />
        {item.cardSetName}
      </div>
    );
  }
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  function filterCardSet(query: string, item: CardSetViewmodel, index?: number, exactMatch?: boolean): boolean {
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
