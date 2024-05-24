import { Selectable } from "kysely";

import { CardfaceTable } from "../../../main/database/schema";

export interface DtoCardface extends Selectable<CardfaceTable> {
  manaCostArray: Array<string>;
}
