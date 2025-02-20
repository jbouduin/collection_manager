import { Cell, CellRenderer } from "@blueprintjs/table";
import * as React from "react";
import { CardSymbolRenderer } from "../card-symbol-renderer";
import { CardSetViewmodel } from "../../../viewmodels";

export function textCellRenderer<T>(data: Array<T>, valueCallBack: (card: T) => string): CellRenderer {
  return (row: number) => (<Cell>{valueCallBack(data[row])} </Cell>);
}

// TODO display the cardsymbol also - maybe use a parameter
export function cardSetRenderer<T>(data: Array<T>, cardSets: Array<CardSetViewmodel>, valueCallBack: (card: T) => string): CellRenderer {
  return (row: number) => {
    const setId = valueCallBack(data[row]);
    const cardSet = cardSets.find((cardSetViewmodel: CardSetViewmodel) => cardSetViewmodel.id == setId);
    return (
      <Cell>
        {cardSet ? cardSet.cardSetName : undefined}
      </Cell>
    );
  };
}

export function symbolRenderer<T>(data: Array<T>, valueCallBack: (card: T) => Array<string>): CellRenderer {
  return (row: number) => (
    <Cell>
      <CardSymbolRenderer cardSymbols={valueCallBack(data[row])} className="mana-cost-image-in-table" />
    </Cell >
  );
}
