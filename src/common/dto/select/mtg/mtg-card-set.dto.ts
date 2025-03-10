import { Selectable } from "kysely";
import { CardSetTable } from "../../../../main/database/schema";

export interface MtgCardSetDto extends Selectable<CardSetTable> {
  svg: string;
}
