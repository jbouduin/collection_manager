import { Selectable } from "kysely";

import { CardSetTable } from "../../../main/database/schema";

export interface DtoCardSet extends Selectable<CardSetTable> {
  svg: string;
}
