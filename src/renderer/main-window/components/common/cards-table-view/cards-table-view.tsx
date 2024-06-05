import { Cell, CellProps, CellRenderer, Column, Region, SelectionModes, Table2 } from "@blueprintjs/table";
import * as React from "react";

import { DtoCard, DtoLanguage } from "../../../../../common/dto";
import { MTGLanguage } from "../../../../../common/enums";
import { CardQueryOptions, QueryParam } from "../../../../../common/ipc-params";
import { CardSetViewmodel, CardViewmodel } from "../../../viewmodels";
import { LanguagesContext } from "../../context";
import { CardSymbolProvider } from "../card-symbol-provider/card-symbol-provider";
import { CardsTableViewProps } from "./cards-table-view.props";


export function CardsTableView(props: CardsTableViewProps) {
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
    const set = props.selectedSets.find((s: CardSetViewmodel) => s.id == cards[row].setId);
    return (<Cell>{set?.cardSetName}</Cell>);
  }


  function languageRenderer(languages: Array<DtoLanguage>, valueCallBack: (card: CardViewmodel) => Array<string>): CellRenderer {
    return (row: number) => (
      <Cell>
        {
          valueCallBack(cards[row])
            .map((language: MTGLanguage) => {
              const languageDef = languages.find((lng: DtoLanguage) => lng.id == language);
              return languageDef ? languageDef.button_text : language;
            })
            .join(", ")
        }
      </Cell>
    );
  }

  function symbolRenderer(valueCallBack: (card: CardViewmodel) => Array<string>): CellRenderer {
    return (row: number) => (
      <Cell>
        <CardSymbolProvider cardSymbols={valueCallBack(cards[row])} />
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
          setIds: props.selectedSets.map((set: CardSetViewmodel) => set.id)
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
      <LanguagesContext.Consumer>
        {
          (languages: Array<DtoLanguage>) => (
            <Table2 numRows={cards?.length ?? 0} selectionModes={SelectionModes.ROWS_AND_CELLS} onSelection={onSelection} selectedRegionTransform={selectedRegionTransform}>
              <Column name="Number" cellRenderer={textCellRenderer((card: CardViewmodel) => card.collectorNumber)} />
              <Column name="Rarity" cellRenderer={textCellRenderer((card: CardViewmodel) => card.rarity)} />
              <Column name="Name" cellRenderer={textCellRenderer((card: CardViewmodel) => card.cardName)} />
              <Column name="Type" cellRenderer={textCellRenderer((card: CardViewmodel) => card.cardtypeLine)} />
              <Column name="Mana cost" cellRenderer={symbolRenderer((card: CardViewmodel) => card.cardManacost)} />
              <Column name="Set" cellRenderer={cardSetNameRenderer} />
              <Column name="Power" cellRenderer={textCellRenderer((card: CardViewmodel) => card.cardPower)} />
              <Column name="Thoughness" cellRenderer={textCellRenderer((card: CardViewmodel) => card.cardThoughness)} />
              <Column name="CI" cellRenderer={symbolRenderer((card: CardViewmodel) => card.colorIdentity)} />
              <Column name="Languages" cellRenderer={languageRenderer(languages, (card: CardViewmodel) => card.languages)} />
            </Table2>
          )
        }
      </LanguagesContext.Consumer>
    </div>
  );
  //#endregion
}
