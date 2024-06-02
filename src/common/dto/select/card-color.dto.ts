import { Selectable } from "kysely";
import { CardColorMapTable } from "../../../main/database/schema";

export interface DtoCardColor extends Selectable<CardColorMapTable> {
  mana_symbol: string;
}
