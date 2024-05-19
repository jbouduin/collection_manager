import { Cell, CellProps, CellRenderer, Column, Region, SelectionModes, Table2 } from "@blueprintjs/table";
import * as React from "react";

import { CardDto, CardSetDto, LanguageDto } from "../../../../../common/dto";
import { CardQueryOptions, QueryParam } from "../../../../../common/ipc-params";
import { SvgProvider } from "../svg-provider/svg-provider";
import { CardsTableProps } from "./cards-table.props";


export function CardsTable(props: CardsTableProps) {
  console.log("in cards table function");
  //#region State -------------------------------------------------------------
  const [cards, setCards] = React.useState(new Array<CardDto>());
  //#endregion

  //#region event handling ----------------------------------------------------
  function selectedRegionTransform(region: Region): Region {
    if (region.cols) {
      return { rows: region.rows };
    } else {
      return region;
    }
  }

  function onSelection(selectedRegions: Array<Region>): void {
    const selectedCards = new Array<CardDto>();
    selectedRegions
      .filter((region: Region) => region.rows)
      .forEach((region: Region) => {
        const firstRow = region.rows[0];
        const lastRow = region.rows[1];
        for (let cnt = firstRow; cnt <= lastRow; cnt++) {
          selectedCards.push(cards[cnt]);
        }
      });
    props.onCardsSelected(selectedCards);
  }
  //#endregion

  //#region Cell renderers ----------------------------------------------------
  function textCellRenderer(valueCallBack: (card: CardDto) => string): CellRenderer {
    return (row: number) => (<Cell>{valueCallBack(cards[row])}</Cell>);
  }

  function setNameRenderer(row: number): React.ReactElement<CellProps> {
    const set = props.selectedSets.filter((s: CardSetDto) => s.cardSet.id == cards[row].card.set_id);
    return (<Cell>{set[0]?.cardSet.name}</Cell>);
  }

  function languageRenderer(row: number): React.ReactElement<CellProps> {
    const lang = cards[row].card.lang;
    const languageDef = props.languages.filter((lng: LanguageDto) => lng.id == lang);
    return (
      <Cell>
        {languageDef.length > 0 ? languageDef[0].display_text : lang}
      </Cell>
    );
  }

  function manaCostRenderer(row: number): React.ReactElement<CellProps> {
    return (
      <Cell>
        {
          cards[row].manaCostArray
            .map((manaCost: string, idx: number) => {
              if (manaCost == "//") {
                return (<span>&nbsp; &nbsp;//&nbsp;&nbsp;</span>);
              } else {
                const cachedSvg = props.cachedSvg.get(manaCost);
                if (cachedSvg) {
                  return (<SvgProvider svg={props.cachedSvg.get(manaCost)} key={`manacost_${idx}`} />);
                } else {
                  console.log(`no cached svg for "${manaCost}" of ${cards[row].card.name} `);
                  return;
                }
              }
            })
        }
      </Cell >
    );
  }
  //#endregion

  //#region Effects -----------------------------------------------------------
  React.useEffect(() => {
    if (props.selectedSets) {
      const cardQueryParam: QueryParam<CardQueryOptions> = {
        type: "Card",
        options: {
          cardId: null,
          setIds: props.selectedSets.map((set: CardSetDto) => set.cardSet.id)
        }
      };
      window.ipc.query(cardQueryParam)
        .then((cardResult: Array<CardDto>) => setCards(cardResult.sort((a: CardDto, b: CardDto) => a.collectorNumberSortValue.localeCompare(b.collectorNumberSortValue))));
    } else {
      setCards(new Array<CardDto>());
    }
  }, [props.selectedSets]);
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <div className="cards-table-wrapper">
      <Table2 className={props.className} numRows={cards?.length ?? 0} selectionModes={SelectionModes.ROWS_AND_CELLS} onSelection={onSelection} selectedRegionTransform={selectedRegionTransform}>
        <Column name="Number" cellRenderer={textCellRenderer((card: CardDto) => card.card.collector_number)} />
        <Column name="Name" cellRenderer={textCellRenderer((card: CardDto) => card.card.name)} />
        <Column name="Rarity" cellRenderer={textCellRenderer((card: CardDto) => card.card.rarity)} />
        <Column name="Mana cost" cellRenderer={manaCostRenderer} />
        <Column name="Power" cellRenderer={textCellRenderer((card: CardDto) => card.card.power)} />
        <Column name="Thoughness" cellRenderer={textCellRenderer((card: CardDto) => card.card.thoughness)} />
        <Column name="Language" cellRenderer={languageRenderer} />
        <Column name="Set" cellRenderer={setNameRenderer} />
      </Table2>
    </div>
  );
  //#endregion
}
