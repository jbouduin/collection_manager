import { Button } from "@blueprintjs/core";
import { cloneDeep, isEmpty, xor } from "lodash";
import * as React from "react";
import { CardRarity, GameFormat } from "../../../../../../../../common/types";
import { DisplayValueService, DisplayValueServiceContext } from "../../../../../../../common/context";
import { displayValueRecordToSelectOptions } from "../../../../../../../common/utils";
import { CardSetViewmodel } from "../../../../../../viewmodels";
import { CardSearchViewmodel } from "../../../../../../viewmodels/card/card-search.viewmodel";
import { CardSetContext } from "../../../../../context";
import { CardSetSelect, CardSetSelectProps } from "./card-set-select";
import { SelectSelectOption } from "./select-select-option";
import { SelectSelectOptionProps } from "./select-select-option.props";
import { SearchViewProps } from "./search-view.props";

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

export function SearchView(props: SearchViewProps) {
  //#region State -----------------------------------------------------------------------
  const [state, setState] = React.useState<CardSearchViewmodel>(new CardSearchViewmodel());
  //#endregion

  //#region Context ---------------------------------------------------------------------
  const cardSetContext = React.useContext<Array<CardSetViewmodel>>(CardSetContext);
  const displayValueService = React.useContext<DisplayValueService>(DisplayValueServiceContext);
  //#endregion

  const rarityItems = React.useMemo(
    () => displayValueRecordToSelectOptions(displayValueService.cardRarityDisplayValues),
    []
  );

  const gameFormats = React.useMemo(
    () => displayValueRecordToSelectOptions(displayValueService.gameFormatDisplayValues),
    []
  );

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
      <CardSetMemo
        cardSets={cardSetContext}
        key="card-set-select"
        onClearOptions={() => onSelectOptionEvent((v) => v.clearCardSetSelection())}
        onOptionAdded={(newOption) => onSelectOptionEvent((v) => v.addCardSet(newOption))}
        onOptionRemoved={(newOption) => onSelectOptionEvent((v) => v.removeCardSet(newOption))}
        selectedCardSets={state.selectedSets}
      />
      <RaritySelectMemo
        items={rarityItems}
        key="rarity-select"
        label="Rarity"
        onClearOptions={() => onSelectOptionEvent((v) => v.clearRaritiesSelection())}
        onOptionAdded={(newOption) => onSelectOptionEvent((v) => v.addRarity(newOption))}
        onOptionRemoved={(newOption) => onSelectOptionEvent((v) => v.removeRarity(newOption))}
        selectedItems={state.selectedRarities}
      />
      <GameFormatMemo
        items={gameFormats}
        key="game-format-select"
        label="Game Format"
        onClearOptions={() => onSelectOptionEvent((v) => v.clearGameFormatSelection())}
        onOptionAdded={(newOption) => onSelectOptionEvent((v) => v.addGameFormat(newOption))}
        onOptionRemoved={(newOption) => onSelectOptionEvent((v) => v.removeGameFormat(newOption))}
        selectedItems={state.selectedGameFormats}
      />
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
