import { FormGroup, MenuItem } from "@blueprintjs/core";
import { ItemRendererProps, MultiSelect } from "@blueprintjs/select";
import * as React from "react";
import { ICatalogItemDto } from "../../../../../../../../common/dto";
import { highlightText } from "../../../../../../../shared/components/utils";
import { IIpcProxyService, IpcProxyServiceContext } from "../../../../../../../shared/context";
import { CatalogSelectProps } from "./catalog-select.props";

export function CatalogSelect(props: CatalogSelectProps) {
  //#region State -------------------------------------------------------------
  const [items, setItems] = React.useState(new Array<ICatalogItemDto>());
  const [queryString, setQueryString] = React.useState<string>(null);
  //#endregion

  //#region Context -----------------------------------------------------------
  const ipcProxyService = React.useContext<IIpcProxyService>(IpcProxyServiceContext);
  //#endregion

  //#region Effects -----------------------------------------------------------
  React.useEffect(
    () => {
      if (queryString != null) {
        const timeOutId = setTimeout(
          () => {
            void ipcProxyService
              .getData<Array<ICatalogItemDto>>(`/catalog/${props.catalogType.catalog_name}?item=${queryString}`)
              .then(
                (r: Array<ICatalogItemDto>) => setItems(r),
                (_r: Error) => setItems(new Array<ICatalogItemDto>())
              );
          },
          500
        );
        return () => clearTimeout(timeOutId);
      }
    },
    [queryString]
  );
  //#endregion

  //#region Event handling ----------------------------------------------------
  function onClear(): void {
    props.onClearSelectedCatalogItems();
  }

  function onRemove(item: ICatalogItemDto): void {
    props.onCatalogItemRemoved(item);
  }

  function onSelect(item: ICatalogItemDto): void {
    const indexOfSelected = props.selectedCatalogItems.findIndex((f: ICatalogItemDto) => f.item == item.item);
    if (indexOfSelected >= 0) {
      props.onCatalogItemRemoved(item);
    } else {
      props.onCatalogItemAdded(item);
    }
  }
  //#endregion

  //#region Rendering ---------------------------------------------------------
  return (
    <FormGroup
      key={props.catalogType.catalog_name}
      label={props.catalogType.display_label}
    >
      <MultiSelect<ICatalogItemDto>
        initialContent={null}
        // itemListPredicate={itemListPredicate}
        itemPredicate={filterOption}
        itemRenderer={(item: ICatalogItemDto, itemProps: ItemRendererProps) => itemRenderer(item, itemProps)}
        items={items}
        key={props.catalogType.catalog_name}
        noResults={<MenuItem disabled={true} roleStructure="listoption" text="No results." />}
        onClear={() => onClear()}
        onItemSelect={(item: ICatalogItemDto) => onSelect(item)}
        onQueryChange={onQueryChange}
        onRemove={(item: ICatalogItemDto) => onRemove(item)}
        popoverProps={{ matchTargetWidth: true, minimal: true }}
        resetOnSelect={true}
        selectedItems={props.selectedCatalogItems}
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
        selected={props.selectedCatalogItems.includes(item)}
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
    setQueryString(query);
  }
  //#endregion
}
