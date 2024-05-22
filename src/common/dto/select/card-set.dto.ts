import { Selectable } from "kysely";
import { CardSetTable } from "../../../main/database/schema";

export interface CardSetDto {
  cardSet: Selectable<CardSetTable>;
  svg: string;
}
