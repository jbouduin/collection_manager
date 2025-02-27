import { Button, Checkbox } from "@blueprintjs/core";
import { cloneDeep, isEmpty, xor } from "lodash";
import * as React from "react";
import { CatalogTypeDto } from "../../../../../../../../common/dto";
import { CardRarity, GameFormat } from "../../../../../../../../common/types";
import { DisplayValueService, DisplayValueServiceContext, IpcProxyService, IpcProxyServiceContext } from "../../../../../../../common/context";
import { displayValueRecordToSelectOptions, handleBooleanChange, SelectOption } from "../../../../../../../common/utils";
import { CardSetViewmodel } from "../../../../../../viewmodels";
import { CardSearchViewmodel } from "../../../../../../viewmodels/card/card-search.viewmodel";
import { CardSetContext } from "../../../../../context";
import { CardSetSelect } from "./card-set-select";
import { CardSetSelectProps } from "./card-set-select.props";
import { CatalogSelect } from "./catalog-select.";
import { CatalogSelectProps } from "./catalog-select.props";
import { SearchViewProps } from "./search-view.props";
import { SelectSelectOption } from "./select-select-option";
import { SelectSelectOptionProps } from "./select-select-option.props";

const RaritySelectMemo = React.memo(
  SelectSelectOption<CardRarity>,
  (prev: SelectSelectOptionProps<CardRarity>, current: SelectSelectOptionProps<CardRarity>) => {
    return isEmpty(xor(prev.items, current.items));
  }
);

const GameFormatMemo = React.memo(
  SelectSelectOption<GameFormat>,
  (prev: SelectSelectOptionProps<GameFormat>, current: SelectSelectOptionProps<GameFormat>) => {
    return isEmpty(xor(prev.items, current.items));
  }
);

const CardSetMemo = React.memo(
  CardSetSelect,
  (prev: CardSetSelectProps, current: CardSetSelectProps) => {
    return isEmpty(xor(prev.cardSets, current.cardSets));
  }
);

const CatalogMemo = React.memo(
  CatalogSelect,
  (prev: CatalogSelectProps, current: CatalogSelectProps) => {
    return prev.catalog === current.catalog;
  }
);

export function SearchView(props: SearchViewProps) {
  //#region State -----------------------------------------------------------------------
  const [state, setState] = React.useState<CardSearchViewmodel>(new CardSearchViewmodel());
  const [catalogs, setCatalogs] = React.useState<Array<CatalogTypeDto>>(new Array<CatalogTypeDto>());
  //#endregion

  //#region Context ---------------------------------------------------------------------
  const cardSetContext = React.useContext<Array<CardSetViewmodel>>(CardSetContext);
  const ipcProxyService = React.useContext<IpcProxyService>(IpcProxyServiceContext);
  const displayValueService = React.useContext<DisplayValueService>(DisplayValueServiceContext);
  //#endregion

  //#region memoized item lists ---------------------------------------------------------
  const rarityItems: Array<SelectOption<CardRarity>> = React.useMemo(
    () => displayValueRecordToSelectOptions(displayValueService.cardRarityDisplayValues),
    []
  );

  const gameFormats: Array<SelectOption<GameFormat>> = React.useMemo(
    () => displayValueRecordToSelectOptions(displayValueService.gameFormatDisplayValues),
    []
  );

  React.useEffect(
    () => {
      void ipcProxyService.getData<Array<CatalogTypeDto>>("/catalog").then((r: Array<CatalogTypeDto>) => setCatalogs(r));
    },
    []
  );
  //#endregion

  //#region Event handling --------------------------------------------------------------
  function onClickSearch(): void {
    props.onSearch(state.toQueryString());
  }

  function onSelectOptionEvent(callBack: (viewModel: CardSearchViewmodel) => void): void {
    const newState = cloneDeep(state);
    callBack(newState);
    setState(newState);
  }
  //#endregion

  //#region Rendering ---------------------------------------------------------
  return (
    <>
      <Checkbox
        checked={state.ownedCards}
        key="owned-cards"
        label="Cards I own"
        onChange={handleBooleanChange((value: boolean) => onSelectOptionEvent((v: CardSearchViewmodel) => v.ownedCards = value))}
      />
      <CardSetMemo
        cardSets={cardSetContext}
        key="card-set-select"
        onClearOptions={() => onSelectOptionEvent((v: CardSearchViewmodel) => v.clearCardSetSelection())}
        onOptionAdded={(newOption) => onSelectOptionEvent((v: CardSearchViewmodel) => v.addCardSet(newOption))}
        onOptionRemoved={(newOption) => onSelectOptionEvent((v: CardSearchViewmodel) => v.removeCardSet(newOption))}
        selectedCardSets={state.selectedSets}
      />
      <RaritySelectMemo
        items={rarityItems}
        key="rarity-select"
        label="Rarity"
        onClearOptions={() => onSelectOptionEvent((v: CardSearchViewmodel) => v.clearRaritiesSelection())}
        onOptionAdded={(newOption) => onSelectOptionEvent((v: CardSearchViewmodel) => v.addRarity(newOption))}
        onOptionRemoved={(newOption) => onSelectOptionEvent((v: CardSearchViewmodel) => v.removeRarity(newOption))}
        selectedItems={state.selectedRarities}
      />
      <GameFormatMemo
        items={gameFormats}
        key="game-format-select"
        label="Game Format"
        onClearOptions={() => onSelectOptionEvent((v: CardSearchViewmodel) => v.clearGameFormatSelection())}
        onOptionAdded={(newOption) => onSelectOptionEvent((v: CardSearchViewmodel) => v.addGameFormat(newOption))}
        onOptionRemoved={(newOption) => onSelectOptionEvent((v: CardSearchViewmodel) => v.removeGameFormat(newOption))}
        selectedItems={state.selectedGameFormats}
      />
      {
        catalogs.filter((c: CatalogTypeDto) => c.count > 0)
          .map((c: CatalogTypeDto) => {
            return (
              <CatalogMemo
                catalog={c}
                onClearOptions={() => onSelectOptionEvent((v: CardSearchViewmodel) => v.clearCatalogSelection(c.catalog_name))}
                onOptionAdded={(newItem) => onSelectOptionEvent((v: CardSearchViewmodel) => v.addCatalogItem(newItem))}
                onOptionRemoved={(removedItem) => onSelectOptionEvent((v: CardSearchViewmodel) => v.removeCatalogItem(removedItem))}
                selectedItems={state.getSelectedCatalogItems(c.catalog_name)}
              />
            );
          })
      }
      <Button
        disabled={!state.hasChanges}
        icon="search"
        onClick={onClickSearch}
      >
        Search
      </Button>
    </>
  );
  //#endregion
}
