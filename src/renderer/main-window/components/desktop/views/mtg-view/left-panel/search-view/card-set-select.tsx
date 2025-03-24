import { FormGroup, MenuItem } from "@blueprintjs/core";
import { ItemRendererProps, MultiSelect } from "@blueprintjs/select";
import * as React from "react";
import { SvgProvider } from "../../../../../../../shared/components/svg-provider";
import { highlightText } from "../../../../../../../shared/components/utils";
import { CardSetSelectProps } from "./card-set-select.props";
import { IMtgCardSetDto } from "../../../../../../../../common/dto";


export function CardSetSelect(props: CardSetSelectProps) {
  //#region Event handling ----------------------------------------------------
  function onClear(): void {
    props.onClearOptions();
  }

  function onRemove(item: IMtgCardSetDto): void {
    props.onOptionRemoved(item);
  }

  function onSelect(item: IMtgCardSetDto): void {
    const indexOfSelected = props.selectedCardSets.findIndex((value: IMtgCardSetDto) => value.id == item.id);
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
      <MultiSelect<IMtgCardSetDto>
        initialContent={null}
        itemPredicate={filterCardSet}
        itemRenderer={(item: IMtgCardSetDto, itemProps: ItemRendererProps) => cardSetItemRenderer(item, itemProps)}
        items={props.allCardSets}
        itemsEqual="id"
        key="card-sets-multi-select"
        noResults={<MenuItem disabled={true} roleStructure="listoption" text="No results." />}
        onClear={() => onClear()}
        onItemSelect={(item: IMtgCardSetDto) => onSelect(item)}
        onRemove={(item: IMtgCardSetDto) => onRemove(item)}
        popoverProps={{ matchTargetWidth: true, minimal: true }}
        resetOnSelect={true}
        selectedItems={props.selectedCardSets}
        tagRenderer={(item: IMtgCardSetDto) => cardSetTagRenderer(item)}
      />
    </FormGroup>
  );

  function cardSetItemRenderer(item: IMtgCardSetDto, itemProps: ItemRendererProps): React.JSX.Element | null {
    if (!itemProps.modifiers.matchesPredicate) {
      return null;
    }
    return (
      <MenuItem
        active={itemProps.modifiers.active}
        disabled={itemProps.modifiers.disabled}
        key={item.id}
        label={item.code}
        onClick={itemProps.handleClick}
        onFocus={itemProps.handleFocus}
        ref={itemProps.ref}
        roleStructure="listoption"
        selected={props.selectedCardSets.includes(item)}
        shouldDismissPopover={false}
        text={(
          <div>
            <SvgProvider svg={item.svg} />
            {highlightText(item.name, itemProps.query)}
          </div>
        )}
      />
    );
  }

  function cardSetTagRenderer(item: IMtgCardSetDto): React.ReactNode {
    return (
      <div key={item.id}>
        <SvgProvider svg={item.svg} />
        {item.name}
      </div>
    );
  }
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  function filterCardSet(query: string, item: IMtgCardSetDto, _index?: number, exactMatch?: boolean): boolean {
    const normalizedTitle = item.name.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    } else {
      return normalizedTitle.indexOf(normalizedQuery) >= 0;
    }
  }
  //#endregion
}
