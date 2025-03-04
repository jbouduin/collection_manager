import * as React from "react";

import { Region, SelectionModes, Table2, Utils } from "@blueprintjs/table";
import { noop } from "lodash";
import { DeckListDto } from "../../../../../../../common/dto";
import { BaseLookupResult, GenericTextColumn, IBaseColumn, onDataSelected, selectedRegionTransformToRowSelection } from "../../../../../../shared/components";
import { IpcProxyService, IpcProxyServiceContext } from "../../../../../../shared/context";
import { DeckListViewmodel } from "../../../../../viewmodels";
import { CenterPanelProps } from "./center-panel.props";
import { CenterPanelState } from "./center-panel.state";

export function CenterPanel(props: CenterPanelProps) {
  //#region State --------------------------------------------------------------
  const initialState: CenterPanelState = {
    decks: new Array<DeckListViewmodel>(),
    sortedIndexMap: new Array<number>()
  };
  const [state, setState] = React.useState<CenterPanelState>(initialState);
  //#endregion

  //#region Context -----------------------------------------------------------
  const ipcProxyService = React.useContext<IpcProxyService>(IpcProxyServiceContext);
  //#endregion

  //#region Effects -----------------------------------------------------------
  // NOW use a callback once we are filtering and refreshing table
  React.useEffect(
    () => {
      void ipcProxyService
        .getData<Array<DeckListDto>>("/deck")
        .then(
          (r: Array<DeckListDto>) => setState({
            decks: r.map((deck: DeckListDto) => new DeckListViewmodel(deck)),
            sortedIndexMap: state.sortedIndexMap
          }),
          (_r: Error) => noop
        );
    },
    []
  );
  //#region

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
            textValue: props.displayServiceValueService.gameFormatDisplayValues[deck.targetFormat] ?? deck.targetFormat
          };
        }
      ));
      return result;
    },
    [props.displayServiceValueService]
  );
  //#endregion

  //#region Rendering ---------------------------------------------------------
  return (
    <Table2
      cellRendererDependencies={[state.decks, state.sortedIndexMap]}
      children={sortableColumnDefinitions.map((c) => c.getColumn(getCellData, sortColumn))}
      numRows={state.decks.length}
      onSelection={(selectedRegions: Array<Region>) => onDataSelected(selectedRegions, state.decks, (decks: Array<DeckListViewmodel>) => props.onDecksSelected(decks))}
      selectedRegionTransform={(region: Region) => selectedRegionTransformToRowSelection(region)}
      selectionModes={SelectionModes.ROWS_AND_CELLS}
    />
  );
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  function getCellData<U>(rowIndex: number, valueCallBack: (row: DeckListViewmodel) => U): U {
    const sortedRowIndex = state.sortedIndexMap[rowIndex];
    if (sortedRowIndex != null) {
      rowIndex = sortedRowIndex;
    }
    return valueCallBack(state.decks[rowIndex]);
  }

  function sortColumn(comparator: (a: DeckListViewmodel, b: DeckListViewmodel) => number) {
    const sortedIndexMap = Utils.times(state.decks.length, (i: number) => i);
    sortedIndexMap.sort((a: number, b: number) => {
      return comparator(state.decks[a], state.decks[b]);
    });
    setState({
      decks: state.decks,
      sortedIndexMap: sortedIndexMap
    });
  }
  //#endregion
}
