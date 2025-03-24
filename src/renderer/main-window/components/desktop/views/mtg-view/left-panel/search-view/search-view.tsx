import { Button, Checkbox } from "@blueprintjs/core";
import { cloneDeep } from "lodash";
import * as React from "react";
import { ICatalogItemDto, ICatalogTypeDto, IColorDto, IGameFormatDto, IMtgCardSetDto } from "../../../../../../../../common/dto";
import { CardRarity, MtgGameFormat } from "../../../../../../../../common/types";
import { displayValueRecordToSelectOptions, handleBooleanChange, SelectOption } from "../../../../../../../shared/components/utils";
import { CardSetContext, DisplayValueService, DisplayValueServiceContext, GameFormatContext, IIpcProxyService, IpcProxyServiceContext } from "../../../../../../../shared/context";
import { CardSearchViewmodel, CardSetViewmodel } from "../../../../../../viewmodels";
import { CardSetSelect } from "./card-set-select";
import { CatalogSelect } from "./catalog-select.";
import { ColorSelect } from "./color-select";
import { SearchViewProps } from "./search-view.props";
import { SelectSelectOption } from "./select-select-option";


export function SearchView(props: SearchViewProps) {
  //#region State -----------------------------------------------------------------------
  const [state, setState] = React.useState<CardSearchViewmodel>(new CardSearchViewmodel());
  const [catalogs, setCatalogs] = React.useState<Array<ICatalogTypeDto>>(new Array<ICatalogTypeDto>());
  const [colors, setColors] = React.useState<Array<IColorDto>>(new Array<IColorDto>());
  //#endregion

  //#region Context ---------------------------------------------------------------------
  const cardSetContext = React.useContext<Array<IMtgCardSetDto>>(CardSetContext);
  const ipcProxyService = React.useContext<IIpcProxyService>(IpcProxyServiceContext);
  const displayValueService = React.useContext<DisplayValueService>(DisplayValueServiceContext);
  const gameFormatContext = React.useContext<Array<IGameFormatDto>>(GameFormatContext);
  //#endregion

  //#region memoized item lists ---------------------------------------------------------
  const rarityItems: Array<SelectOption<CardRarity>> = React.useMemo(
    () => displayValueRecordToSelectOptions(displayValueService.cardRarityDisplayValues),
    []
  );

  const gameFormats: Array<SelectOption<MtgGameFormat>> = React.useMemo(
    () => new Array<SelectOption<MtgGameFormat>>(...gameFormatContext.map((g: IGameFormatDto) => {
      return { value: g.id, label: g.display_text };
    })),
    [gameFormatContext]
  );

  React.useEffect(
    () => {
      void Promise
        .all([
          ipcProxyService.getData<Array<ICatalogTypeDto>>("/catalog"),
          ipcProxyService.getData<Array<IColorDto>>("/color")
        ])
        .then(
          (value: [Array<ICatalogTypeDto>, Array<IColorDto>]) => {
            setCatalogs(value[0]);
            setColors(value[1]);
          },
          (_r: Error) => {
            setCatalogs(new Array<ICatalogTypeDto>());
            setColors(new Array<IColorDto>());
          }
        );
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
        allCardSets={cardSetContext.map((c: IMtgCardSetDto) => new CardSetViewmodel(c))}
        key="card-set-select"
        onClearOptions={() => onSelectOptionEvent((v: CardSearchViewmodel) => v.clearCardSetSelection())}
        onOptionAdded={(cardSet: CardSetViewmodel) => onSelectOptionEvent((v: CardSearchViewmodel) => v.addCardSet(cardSet))}
        onOptionRemoved={(cardSet: CardSetViewmodel) => onSelectOptionEvent((v: CardSearchViewmodel) => v.removeCardSet(cardSet))}
        selectedCardSets={state.selectedCardSets}
      />
      <ColorSelect
        allColors={colors}
        colorType="card"
        label="Card color"
        onClearOptions={() => onSelectOptionEvent((v: CardSearchViewmodel) => v.clearColorSelection("card"))}
        onOptionAdded={(color: IColorDto) => onSelectOptionEvent((v: CardSearchViewmodel) => v.addColor("card", color))}
        onOptionRemoved={(color: IColorDto) => onSelectOptionEvent((v: CardSearchViewmodel) => v.removeColor("card", color))}
        selectedColors={state.selectedCardColors}
      />
      <ColorSelect
        allColors={colors}
        colorType="produced_mana"
        label="Produced mana color"
        onClearOptions={() => onSelectOptionEvent((v: CardSearchViewmodel) => v.clearColorSelection("produced_mana"))}
        onOptionAdded={(color: IColorDto) => onSelectOptionEvent((v: CardSearchViewmodel) => v.addColor("produced_mana", color))}
        onOptionRemoved={(color: IColorDto) => onSelectOptionEvent((v: CardSearchViewmodel) => v.removeColor("produced_mana", color))}
        selectedColors={state.selectedProducedManaColors}
      />
      <ColorSelect
        allColors={colors}
        colorType="identity"
        label="Identity color"
        onClearOptions={() => onSelectOptionEvent((v: CardSearchViewmodel) => v.clearColorSelection("identity"))}
        onOptionAdded={(color: IColorDto) => onSelectOptionEvent((v: CardSearchViewmodel) => v.addColor("identity", color))}
        onOptionRemoved={(color: IColorDto) => onSelectOptionEvent((v: CardSearchViewmodel) => v.removeColor("identity", color))}
        selectedColors={state.selectedIdentityColors}
      />
      <SelectSelectOption<CardRarity>
        allItems={rarityItems}
        key="rarity-select"
        label="Rarity"
        onClearOptions={() => onSelectOptionEvent((v: CardSearchViewmodel) => v.clearRaritiesSelection())}
        onOptionAdded={(option: SelectOption<CardRarity>) => onSelectOptionEvent((v: CardSearchViewmodel) => v.addRarity(option))}
        onOptionRemoved={(option: SelectOption<CardRarity>) => onSelectOptionEvent((v: CardSearchViewmodel) => v.removeRarity(option))}
        selectedItems={state.selectedRarities}
      />
      <SelectSelectOption<MtgGameFormat>
        allItems={gameFormats}
        key="game-format-select"
        label="Game Format"
        onClearOptions={() => onSelectOptionEvent((v: CardSearchViewmodel) => v.clearGameFormatSelection())}
        onOptionAdded={(option: SelectOption<MtgGameFormat>) => onSelectOptionEvent((v: CardSearchViewmodel) => v.addGameFormat(option))}
        onOptionRemoved={(option: SelectOption<MtgGameFormat>) => onSelectOptionEvent((v: CardSearchViewmodel) => v.removeGameFormat(option))}
        selectedItems={state.selectedGameFormats}
      />
      {
        catalogs.filter((c: ICatalogTypeDto) => c.count > 0)
          .map((c: ICatalogTypeDto) => {
            return (
              <CatalogSelect
                catalogType={c}
                key={c.catalog_name}
                onCatalogItemAdded={(item: ICatalogItemDto) => onSelectOptionEvent((v: CardSearchViewmodel) => v.addCatalogItem(item))}
                onCatalogItemRemoved={(item: ICatalogItemDto) => onSelectOptionEvent((v: CardSearchViewmodel) => v.removeCatalogItem(item))}
                onClearSelectedCatalogItems={() => onSelectOptionEvent((v: CardSearchViewmodel) => v.clearCatalogSelection(c.catalog_name))}
                selectedCatalogItems={state.getSelectedCatalogItems(c.catalog_name)}
              />
            );
          })
      }
      <Button
        icon="search"
        onClick={onClickSearch}
      >
        Search
      </Button>
    </div>
  );
  //#endregion
}
