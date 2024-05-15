import { Cell, CellProps, CellRenderer, Column, CoordinateData, Region, SelectionModes, Table2 } from "@blueprintjs/table";
import * as React from "react";

import { CardSelectDto } from "../../../../../common/dto";
import { CardQueryOptions, IQueryOrSyncParam } from "../../../../../common/ipc-params";
import { SvgProvider } from "../svg-provider/svg-provider";
import { CardsTableProps } from "./cards-table.props";


export function CardsTable(props: CardsTableProps) {
  console.log("in cards table function");
  //#region State -------------------------------------------------------------
  const [cards, setCards] = React.useState(new Array<CardSelectDto>());
  //#endregion

  //#region event handling ----------------------------------------------------
  function selectedRegionTransform(region: Region, _event: MouseEvent | KeyboardEvent, _coords?: CoordinateData): Region {
    console.log(region);
    if (region.cols) {
      return { rows: region.rows };
    } else {
      return region;
    }
  }

  function onSelection(selectedRegions: Array<Region>): void {
    if (selectedRegions[0]?.rows) {
      props.onCardSelected(cards[selectedRegions[0].rows[0]].card.id);
    }
  }
  //#endregion

  //#region Cell renderers ----------------------------------------------------
  function textCellRenderer(valueCallBack: (card: CardSelectDto) => string): CellRenderer {
    return (row: number) => (<Cell>{valueCallBack(cards[row])}</Cell>);
  }

  function manaCostRenderer(row: number): React.ReactElement<CellProps> {
    return (
      <Cell>
        {
          cards[row].manaCostArray.map((manaCost: string) => {
            return <SvgProvider svg={props.cachedSvg.get(manaCost)} />;
          })
        }
      </Cell >
    );
  }
  //#endregion

  //#region Effects -----------------------------------------------------------
  React.useEffect(() => {
    if (props.selectedSetIds) {
      const cardQueryParam: IQueryOrSyncParam<CardQueryOptions> = {
        type: "Card",
        options: {
          cardId: null,
          setIds: props.selectedSetIds
        }
      };
      window.ipc.query(cardQueryParam)
        .then((cardResult: Array<CardSelectDto>) => setCards(cardResult));
    } else {
      setCards(new Array<CardSelectDto>());
    }
  }, [props.selectedSetIds]);
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <div className="cards-table-wrapper">
      <Table2 className={props.className} numRows={cards?.length ?? 0} selectionModes={SelectionModes.ROWS_AND_CELLS} onSelection={onSelection} selectedRegionTransform={selectedRegionTransform}>
        <Column name="Name" cellRenderer={textCellRenderer((card: CardSelectDto) => card.card.name)} />
        <Column name="Rarity" cellRenderer={textCellRenderer((card: CardSelectDto) => card.card.rarity)} />
        <Column name="Mana cost" cellRenderer={manaCostRenderer.bind(this)} />
        <Column name="Power" cellRenderer={textCellRenderer((card: CardSelectDto) => card.card.power)} />
        <Column name="Thoughness" cellRenderer={textCellRenderer((card: CardSelectDto) => card.card.thoughness)} />
      </Table2>
    </div>
  );
  //#endregion
}
