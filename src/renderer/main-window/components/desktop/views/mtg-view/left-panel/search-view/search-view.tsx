import { Button, Checkbox } from "@blueprintjs/core";
import { cloneDeep } from "lodash";
import * as React from "react";
import { CatalogTypeDto, ColorDto } from "../../../../../../../../common/dto";
import { CardRarity, GameFormat, MTGColor } from "../../../../../../../../common/types";
import { DisplayValueService, DisplayValueServiceContext, IpcProxyService, IpcProxyServiceContext } from "../../../../../../../common/context";
import { displayValueRecordToSelectOptions, handleBooleanChange, SelectOption } from "../../../../../../../common/utils";
import { CardSetViewmodel } from "../../../../../../viewmodels";
import { CardSearchViewmodel } from "../../../../../../viewmodels/card/card-search.viewmodel";
import { CardSetContext } from "../../../../../context";
import { CardSetSelect } from "./card-set-select";
import { CatalogSelect } from "./catalog-select.";
import { ColorSelect } from "./color-select";
import { SearchViewProps } from "./search-view.props";
import { SelectSelectOption } from "./select-select-option";

/* eslint-disable @stylistic/multiline-comment-style */
/* TODO check why this did not work as expected
 do this when implementing saved searches, because there is something strange witht he selects anyway
 if there is no way to get it working -> rethink state in the selects

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
*/
/* eslint-enable @stylistic/multiline-comment-style */

export function SearchView(props: SearchViewProps) {
  //#region State -----------------------------------------------------------------------
  const [state, setState] = React.useState<CardSearchViewmodel>(new CardSearchViewmodel());
  const [catalogs, setCatalogs] = React.useState<Array<CatalogTypeDto>>(new Array<CatalogTypeDto>());
  const [colors, setColors] = React.useState<Array<ColorDto>>(new Array<ColorDto>());
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
      void Promise
        .all([
          ipcProxyService.getData<Array<CatalogTypeDto>>("/catalog"),
          ipcProxyService.getData<Array<ColorDto>>("/colors")
        ])
        .then((value: [Array<CatalogTypeDto>, Array<ColorDto>]) => {
          setCatalogs(value[0]);
          setColors(value[1]);
        });
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
    <div className="left-panel-search-panel">
      <Checkbox
        checked={state.ownedCards}
        key="owned-cards"
        label="Cards I own"
        onChange={handleBooleanChange((value: boolean) => onSelectOptionEvent((v: CardSearchViewmodel) => v.ownedCards = value))}
      />
      <CardSetSelect
        cardSets={cardSetContext}
        key="card-set-select"
        onClearOptions={() => onSelectOptionEvent((v: CardSearchViewmodel) => v.clearCardSetSelection())}
        onOptionAdded={(cardSet: string) => onSelectOptionEvent((v: CardSearchViewmodel) => v.addCardSet(cardSet))}
        onOptionRemoved={(cardSet: string) => onSelectOptionEvent((v: CardSearchViewmodel) => v.removeCardSet(cardSet))}
        selectedCardSets={state.selectedSets}
      />
      <ColorSelect
        colorType="card"
        colors={colors}
        label="Card color"
        onClearOptions={() => onSelectOptionEvent((v: CardSearchViewmodel) => v.clearColorSelection("card"))}
        onOptionAdded={(color: MTGColor) => onSelectOptionEvent((v: CardSearchViewmodel) => v.addColor("card", color, colors))}
        onOptionRemoved={(color) => onSelectOptionEvent((v: CardSearchViewmodel) => v.removeColor("card", color))}
        selectedColors={state.selectedCardColors}
      />
      <ColorSelect
        colorType="produced_mana"
        colors={colors}
        label="Produced mana color"
        onClearOptions={() => onSelectOptionEvent((v: CardSearchViewmodel) => v.clearColorSelection("produced_mana"))}
        onOptionAdded={(color: MTGColor) => onSelectOptionEvent((v: CardSearchViewmodel) => v.addColor("produced_mana", color, colors))}
        onOptionRemoved={(color: MTGColor) => onSelectOptionEvent((v: CardSearchViewmodel) => v.removeColor("produced_mana", color))}
        selectedColors={state.selectedProducedManaColors}
      />
      <ColorSelect
        colorType="identity"
        colors={colors}
        label="Identity color"
        onClearOptions={() => onSelectOptionEvent((v: CardSearchViewmodel) => v.clearColorSelection("identity"))}
        onOptionAdded={(color: MTGColor) => onSelectOptionEvent((v: CardSearchViewmodel) => v.addColor("identity", color, colors))}
        onOptionRemoved={(color: MTGColor) => onSelectOptionEvent((v: CardSearchViewmodel) => v.removeColor("identity", color))}
        selectedColors={state.selectedIdentityColors}
      />
      <SelectSelectOption<CardRarity>
        items={rarityItems}
        key="rarity-select"
        label="Rarity"
        onClearOptions={() => onSelectOptionEvent((v: CardSearchViewmodel) => v.clearRaritiesSelection())}
        onOptionAdded={(newOption) => onSelectOptionEvent((v: CardSearchViewmodel) => v.addRarity(newOption))}
        onOptionRemoved={(newOption) => onSelectOptionEvent((v: CardSearchViewmodel) => v.removeRarity(newOption))}
        selectedItems={state.selectedRarities}
      />
      <SelectSelectOption<GameFormat>
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
              <CatalogSelect
                catalog={c}
                key={c.catalog_name}
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
    </div>
  );
  //#endregion
}
