import { Selectable } from "kysely";
import { CatalogTypeTable } from "../../../main/database/schema";


export interface ICatalogTypeDto extends Selectable<CatalogTypeTable> {
  count: number;
}
