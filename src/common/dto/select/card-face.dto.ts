import { Selectable } from "kysely";

import { CardfaceTable } from "../../../main/database/schema";
import { CardfaceColorDto, DtoOracle } from "..";

export interface DtoCardface extends Selectable<CardfaceTable> {
  cardfaceColors: Array<CardfaceColorDto>;
  oracle: DtoOracle;
}
