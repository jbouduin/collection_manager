import { sql } from "kysely";
import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { DatabaseSchema } from "../../../../main/database/schema";
import { ISymbologyColorMapAdapter } from "../interfaces";


// TODO create a "map adapter" or change the signature of the interface
export class SymbologyColorMapAdapter implements ISymbologyColorMapAdapter {
  toInsert(scryfall: { colorId: string, symbologyId: string }): InsertExpression<DatabaseSchema, "symbology_color_map"> {
    return {
      color_id: scryfall.colorId,
      symbology_id: scryfall.symbologyId
    };
  }

  toUpdate(): UpdateObjectExpression<DatabaseSchema, "symbology_color_map"> {
    return {
      last_synced_at: sql`CURRENT_TIMESTAMP`
    };
  }
}
