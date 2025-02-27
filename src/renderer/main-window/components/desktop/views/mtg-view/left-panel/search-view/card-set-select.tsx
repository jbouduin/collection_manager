import { FormGroup, MenuItem, Props } from "@blueprintjs/core";
import { CardSetViewmodel } from "../../../../../../viewmodels";
import * as React from "react";
import { ItemRendererProps, MultiSelect } from "@blueprintjs/select";
import { SvgProvider } from "../../../../../common/svg-provider/svg-provider";
import { highlightText } from "../../../../../../../common/components/highlight-text";
import { cloneDeep } from "lodash";

export interface CardSetSelectProps extends Props {
  cardSets: Array<CardSetViewmodel>;
  selectedCardSets: Array<string>;

  onOptionAdded: (cardSetId: string) => void;
  onOptionRemoved: (cardSetId: string) => void;
  onClearOptions: () => void;
}
export function CardSetSelect(props: CardSetSelectProps) {
  const initialState = props.selectedCardSets.map((id: string) => props.cardSets.find((f: CardSetViewmodel) => f.id == id));
  const [state, setState] = React.useState<Array<CardSetViewmodel>>(initialState);

  //#region Event handling ----------------------------------------------------
  function onClear(): void {
    props.onClearOptions();
    setState(new Array<CardSetViewmodel>());
  }

  function onRemove(item: CardSetViewmodel): void {
    const newState = cloneDeep(state);
    const indexOfSelected = newState.findIndex((value: CardSetViewmodel) => value.id == item.id);
    newState.splice(indexOfSelected, 1);
    props.onOptionRemoved(item.id);
    setState(newState);
  }

  function onSelect(item: CardSetViewmodel): void {
    const newState = cloneDeep(state);
    const indexOfSelected = newState.findIndex((value: CardSetViewmodel) => value.id == item.id);
    if (indexOfSelected >= 0) {
      newState.splice(indexOfSelected, 1);
      props.onOptionRemoved(item.id);
    } else {
      newState.push(item);
      props.onOptionAdded(item.id);
    }
    setState(newState);
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
        items={props.cardSets}
        itemsEqual="id"
        key="card-sets-multi-select"
        noResults={<MenuItem disabled={true} roleStructure="listoption" text="No results." />}
        onClear={() => onClear()}
        onItemSelect={(item: CardSetViewmodel) => onSelect(item)}
        onRemove={(item: CardSetViewmodel) => onRemove(item)}
        popoverProps={{ matchTargetWidth: true, minimal: true }}
        resetOnSelect={true}
        selectedItems={state}
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
        selected={state.includes(item)}
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
