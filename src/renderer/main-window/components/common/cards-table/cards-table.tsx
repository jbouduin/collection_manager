import { Cell, CellProps, CellRenderer, Column, Region, SelectionModes, Table2 } from "@blueprintjs/table";
import * as React from "react";

import { DtoCard, CardSetDto } from "../../../../../common/dto";
import { CardQueryOptions, QueryParam } from "../../../../../common/ipc-params";
import { CardViewmodel } from "../../../view-models/card.view-model";
import { SvgProvider } from "../svg-provider/svg-provider";
import { CardsTableProps } from "./cards-table.props";


export function CardsTable(props: CardsTableProps) {
  console.log("in cards table function");
  //#region State -------------------------------------------------------------
  const [cards, setCards] = React.useState(new Array<CardViewmodel>());
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
    const selectedCards = new Array<CardViewmodel>();
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
  function textCellRenderer(valueCallBack: (card: CardViewmodel) => string): CellRenderer {
    return (row: number) => (<Cell>{valueCallBack(cards[row])}</Cell>);
  }

  function cardSetNameRenderer(row: number): React.ReactElement<CellProps> {
    const set = props.selectedSets.filter((s: CardSetDto) => s.cardSet.id == cards[row].setId);
    return (<Cell>{set[0]?.cardSet.name}</Cell>);
  }

  // FEATURE multilanguage
  // function languageRenderer(row: number): React.ReactElement<CellProps> {
  //   const lang = cards[row].card.lang;
  //   const lang = "en";
  //   const languageDef = props.languages.filter((lng: LanguageDto) => lng.id == lang);
  //   return (
  //     <Cell>
  //       {languageDef.length > 0 ? languageDef[0].display_text : lang}
  //     </Cell>
  //   );
  // }

  function manaCostRenderer(row: number): React.ReactElement<CellProps> {
    return (
      <Cell>
        {
          cards[row].cardManacost
            .map((manaCost: string, idx: number) => {
              if (manaCost == "//") {
                return (<span>&nbsp; &nbsp;//&nbsp;&nbsp;</span>);
              } else {
                const cachedSvg = props.cachedSvg.get(manaCost);
                if (cachedSvg) {
                  return (<SvgProvider svg={props.cachedSvg.get(manaCost)} key={`manacost_${idx}`} />);
                } else {
                  console.log(`no cached svg for "${manaCost}" of ${cards[row].cardName} `);
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
        .then((cardResult: Array<DtoCard>) => {
          console.log(`retrieved ${cardResult.length} cards`);
          setCards(
            cardResult
              .map((card: DtoCard) => new CardViewmodel(card))
              .sort((a: CardViewmodel, b: CardViewmodel) => a.collectorNumberSortValue.localeCompare(b.collectorNumberSortValue))
          );
        });
    } else {
      setCards(new Array<CardViewmodel>());
    }
  }, [props.selectedSets]);
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <div className="cards-table-wrapper">
      <Table2 className={props.className} numRows={cards?.length ?? 0} selectionModes={SelectionModes.ROWS_AND_CELLS} onSelection={onSelection} selectedRegionTransform={selectedRegionTransform} >
        <Column name="Number" cellRenderer={textCellRenderer((card: CardViewmodel) => card.collectorNumber)} />
        <Column name="Name" cellRenderer={textCellRenderer((card: CardViewmodel) => card.cardName)} />
        <Column name="Rarity" cellRenderer={textCellRenderer((card: CardViewmodel) => card.rarity)} />
        <Column name="Mana cost" cellRenderer={manaCostRenderer} />
        <Column name="Set" cellRenderer={cardSetNameRenderer} />
        <Column name="Power" cellRenderer={textCellRenderer((card: CardViewmodel) => card.cardPower)} />
        <Column name="Thoughness" cellRenderer={textCellRenderer((card: CardViewmodel) => card.cardThoughness)} />
      </Table2>
    </div>
  );
  // <Column name="Language" cellRenderer={languageRenderer} />
  //#endregion
}
