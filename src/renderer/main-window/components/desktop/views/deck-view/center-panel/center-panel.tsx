import { MenuContext, Region, SelectionModes, Table2, Utils } from "@blueprintjs/table";
import * as React from "react";
import { BaseLookupResult, ColorIdentityColumn, GenericTextColumn, IBaseColumn, onDataSelected, selectedRegionTransformToRowSelection } from "../../../../../../shared/components";
import { DeckListViewmodel } from "../../../../../viewmodels";
import { CenterPanelProps } from "./center-panel.props";
import { Menu, MenuItem } from "@blueprintjs/core";
import { GameFormatDto } from "../../../../../../../common/dto";
import { GameFormatContext } from "../../../../../../shared/context";


export function CenterPanel(props: CenterPanelProps) {
  //#region State --------------------------------------------------------------
  const [state, setState] = React.useState<Array<number>>(new Array<number>());
  //#endregion

  //#region Context -----------------------------------------------------------
  const gameFormatContext = React.useContext<Array<GameFormatDto>>(GameFormatContext);
  //#endregion

  //#region Memo --------------------------------------------------------------
  const sortableColumnDefinitions = React.useMemo(
    () => {
      const result = new Array<IBaseColumn<unknown, BaseLookupResult>>();
      result.push(new GenericTextColumn<DeckListViewmodel>(
        1,
        "Name",
        (deck: DeckListViewmodel) => {
          return { defaultSortColumn: deck.name, textValue: deck.name };
        }
      ));
      result.push(new GenericTextColumn<DeckListViewmodel>(
        2,
        "Target format",
        (deck: DeckListViewmodel) => {
          return {
            defaultSortColumn: deck.name,
            textValue: gameFormatContext.find((g: GameFormatDto) => g.id == deck.targetFormat)?.display_text || deck.targetFormat
          };
        }
      ));
      result.push(new ColorIdentityColumn<DeckListViewmodel>(
        3,
        "CI",
        (deck: DeckListViewmodel) => {
          return {
            defaultSortColumn: DeckListViewmodel.name,
            colorIdentitySortValue: deck.coloridentitySortValue,
            symbols: deck.colorIdentity
          };
        }
      ));
      return result;
    },
    [gameFormatContext]
  );
  //#endregion

  //#region Rendering ---------------------------------------------------------
  return (
    <div className="cards-table-wrapper">
      {/* LATER Check why blueprint hotkeys are not working */}
      <Table2
        bodyContextMenuRenderer={(context: MenuContext) => contextMenu(context)}
        cellRendererDependencies={[props.decks, state]}
        children={sortableColumnDefinitions.map((c) => c.getColumn(getCellData, sortColumn))}
        numRows={props.decks.length}
        onSelection={(selectedRegions: Array<Region>) => onDataSelected(selectedRegions, props.decks, (decks: Array<DeckListViewmodel>) => props.onDecksSelected(decks))}
        selectedRegionTransform={(region: Region) => selectedRegionTransformToRowSelection(region)}
        selectionModes={SelectionModes.ROWS_AND_CELLS}
      />
    </div>
  );

  function contextMenu(context: MenuContext): React.JSX.Element {
    return (
      <Menu>
        {/* NOW once sorted this 'props.decks[context.getTarget().rows[0]]' is wrong */}
        <MenuItem
          onClick={() => props.onEditDeck(props.decks[context.getTarget().rows[0]])}
          text="Edit"
        />
        <MenuItem
          onClick={() => props.onDeleteDeck(props.decks[context.getTarget().rows[0]])}
          text="Delete"
        />
      </Menu>
    );
  }
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  function getCellData<U>(rowIndex: number, valueCallBack: (row: DeckListViewmodel) => U): U {
    const sortedRowIndex = state[rowIndex];
    if (sortedRowIndex != null) {
      rowIndex = sortedRowIndex;
    }
    return valueCallBack(props.decks[rowIndex]);
  }

  function sortColumn(comparator: (a: DeckListViewmodel, b: DeckListViewmodel) => number) {
    const sortedIndexMap = Utils.times(props.decks.length, (i: number) => i);
    sortedIndexMap.sort((a: number, b: number) => {
      return comparator(props.decks[a], props.decks[b]);
    });
    setState(sortedIndexMap);
  }
  //#endregion
}
