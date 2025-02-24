import { Cell, CellRenderer } from "@blueprintjs/table";
import * as React from "react";
import { CardSymbolRenderer } from "../card-symbol-renderer";
import { CardSetViewmodel } from "../../../viewmodels";
import { SvgProvider } from "../svg-provider/svg-provider";
import { getRarityColorClassname } from "../../../../common/utils";
import { CardRarity } from "../../../../../common/types";

export function textCellRenderer<T>(data: Array<T>, valueCallBack: (card: T) => string): CellRenderer {
  return (row: number) => (<Cell>{valueCallBack(data[row])} </Cell>);
}


export function cardSetRenderer<T>(data: Array<T>, displaySymbol: boolean, cardSets: Array<CardSetViewmodel>, valueCallBack: (card: T) => [string, CardRarity]): CellRenderer {
  return (row: number) => {
    const [setId, rarity] = valueCallBack(data[row]);
    const cardSet = cardSets.find((cardSetViewmodel: CardSetViewmodel) => cardSetViewmodel.id == setId);
    return cardSet
      ?
      (
        <Cell>
          {displaySymbol && <SvgProvider svg={cardSet.cardSetSvg} className={getRarityColorClassname(rarity)}/>}
          {cardSet.cardSetName}
        </Cell>
      )
      : (<Cell />);
  };
}

export function symbolRenderer<T>(data: Array<T>, valueCallBack: (card: T) => Array<string>): CellRenderer {
  return (row: number) => (
    <Cell>
      <CardSymbolRenderer cardSymbols={valueCallBack(data[row])} className="mana-cost-image-in-table" />
    </Cell >
  );
}
