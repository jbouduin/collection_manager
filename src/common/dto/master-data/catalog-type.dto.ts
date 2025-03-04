import { Selectable } from "kysely";
import { CatalogTypeTable } from "../../../main/database/schema";


export interface CatalogTypeDto extends Selectable<CatalogTypeTable> {
  count: number;
}
