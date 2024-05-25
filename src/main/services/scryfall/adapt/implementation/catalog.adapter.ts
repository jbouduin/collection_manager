import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";


import { DatabaseSchema } from "../../../../database/schema";
import { ICatalogAdapter } from "../interface";
import { CatalogAdapterParam } from "../interface/param";

export class CatalogAdapter implements ICatalogAdapter {
  public toInsert(scryfall: CatalogAdapterParam): InsertExpression<DatabaseSchema, "catalog_item"> {
    return {
      catalog_name: scryfall.catalogType,
      item: scryfall.item
    };
  }

  public toUpdate(): UpdateObjectExpression<DatabaseSchema, "catalog_item"> {
    throw new Error("Method not supported");
  }
}
