import { sql } from "kysely";
import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";
import { v1 as uuidV1 } from "uuid";

import { CatalogType } from "../../../../common/enums";
import { DatabaseSchema } from "../../../../main/database/schema";
import { ICatalogAdapter } from "../interfaces/catalog.adapter";

export class CatalogAdapter implements ICatalogAdapter {
  toInsert(scryfall: { catalogType: CatalogType, item: string}): InsertExpression<DatabaseSchema, "catalog_item"> {
    return {
      id: uuidV1(),
      catalog_name: scryfall.catalogType,
      item: scryfall.item
    };
  }

  toUpdate(): UpdateObjectExpression<DatabaseSchema, "catalog_item"> {
    return {
      last_synced_at: sql`CURRENT_TIMESTAMP`
    };
  }
}
