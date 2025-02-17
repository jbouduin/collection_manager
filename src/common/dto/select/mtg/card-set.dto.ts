import { Selectable } from "kysely";
import { CardSetTable } from "../../../../main/database/schema";

export interface CardSetDto extends Selectable<CardSetTable> {
  svg: string;
}
