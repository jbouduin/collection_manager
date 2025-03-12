import { Selectable } from "kysely";
import { CardSetTable } from "../../../main/database/schema";

export interface IMtgCardSetDto extends Selectable<CardSetTable> {
  svg: string;
}
