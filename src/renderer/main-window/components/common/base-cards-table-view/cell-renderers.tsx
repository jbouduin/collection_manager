import { Cell, CellRenderer } from "@blueprintjs/table";
import * as React from "react";
import { CardSymbolProvider } from "../card-symbol-provider/card-symbol-provider";
import { CardSetViewmodel } from "../../../viewmodels";

export function textCellRenderer<T>(data: Array<T>, valueCallBack: (card: T) => string): CellRenderer {
  return (row: number) => (<Cell>{valueCallBack(data[row])} </Cell>);
}

export function cardSetNameRenderer<T>(data: Array<T>, cardSets: Array<CardSetViewmodel>, idExtractor: (card: T) => string): CellRenderer {
  return (row: number) => {
    const set = cardSets.find((s: CardSetViewmodel) => s.id == idExtractor(data[row]));
    return (<Cell>{set?.cardSetName} </Cell>);
  }
}

export function symbolRenderer<T>(data: Array<T>, valueCallBack: (card: T) => Array<string>): CellRenderer {
  return (row: number) => (
    <Cell>
      <CardSymbolProvider cardSymbols={valueCallBack(data[row])} className="mana-cost-image-in-table" />
    </Cell >
  );
}
