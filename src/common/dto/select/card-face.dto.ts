import { Selectable } from "kysely";

import { CardfaceTable } from "../../../main/database/schema";
import { DtoCardfaceColor } from "..";

export interface DtoCardface extends Selectable<CardfaceTable> {
  cardfaceColors: Array<DtoCardfaceColor>;
}
