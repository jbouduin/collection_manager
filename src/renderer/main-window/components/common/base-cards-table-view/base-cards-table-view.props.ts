import { Props } from "@blueprintjs/core";
import { ColumnProps } from "@blueprintjs/table";


export interface BaseCardsTableViewProps<T> extends Props {
  data: Array<T>;
  onCardsSelected(cards?: Array<T>): void;
  columnDefinitions: Array<React.ReactElement<ColumnProps>>;
}
