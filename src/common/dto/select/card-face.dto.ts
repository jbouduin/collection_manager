import { Selectable } from "kysely";

import { CardfaceTable } from "../../../main/database/schema";
import { DtoCardfaceColor, DtoOracle } from "..";

export interface DtoCardface extends Selectable<CardfaceTable> {
  cardfaceColors: Array<DtoCardfaceColor>;
  oracle: DtoOracle;
}
