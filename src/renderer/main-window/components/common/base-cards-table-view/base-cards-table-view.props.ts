import { Props } from "@blueprintjs/core";

import { CardSetViewmodel, CardViewmodel } from "../../../viewmodels";
import { Column, ColumnProps } from "@blueprintjs/table";


export interface BaseCardsTableViewProps<T> extends Props {
  data: Array<T>;
  onCardsSelected(cards?: Array<T>): void;
  columnDefinitions: Array<React.ReactElement<ColumnProps>>;
}
