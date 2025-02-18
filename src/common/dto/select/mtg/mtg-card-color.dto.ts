import { Selectable } from "kysely";
import { CardColorMapTable } from "../../../../main/database/schema";

export interface MtgCardColorDto extends Selectable<CardColorMapTable> {
  mana_symbol: string;
}
