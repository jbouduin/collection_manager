import { Selectable } from "kysely";
import { CardColorMapTable } from "../../../main/database/schema";

export interface IMtgCardColorDto extends Selectable<CardColorMapTable> {
  sequence: number;
  mana_symbol: string;
}
