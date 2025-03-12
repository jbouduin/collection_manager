import { ColumnType } from "kysely";
import { IDeckSizeQuantityOperator, INumberOfCardsQuantityOperator } from "../../../../common/dto";
import { MtgGameFormat } from "../../../../common/types";
import { SynchronizedWithStringId } from "../base.types";

/*
 * LATER add description
 * add certain rules in some way -> like cards new then, older then, etc...
 */
export interface GameFormatTable extends SynchronizedWithStringId<MtgGameFormat> {
  sequence: number;
  display_text: string;
  deck_size_quantity: ColumnType<number>;
  deck_size_operator: ColumnType<IDeckSizeQuantityOperator>;
  sideboard_size_quantity: ColumnType<number>;
  sideboard_size_operator: ColumnType<IDeckSizeQuantityOperator>;
  max_card_quantity: ColumnType<number>;
  max_card_operator: ColumnType<INumberOfCardsQuantityOperator>;
}
