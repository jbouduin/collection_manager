import { sql } from "kysely";
import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { DatabaseSchema } from "../../../../main/database/schema";
import { ISymbologyAlternativeAdapter } from "../interfaces";

// TODO create a "child table adapter" or change the signature of the interface
export class SymbologyAlternativeAdapter implements ISymbologyAlternativeAdapter {
  toInsert(scryFall: { alternative: string, symbologyId: string }): InsertExpression<DatabaseSchema, "symbology_alternative"> {
    return {
      alternative: scryFall.alternative,
      symbology_id: scryFall.symbologyId
    };
  }

  toUpdate(): UpdateObjectExpression<DatabaseSchema, "symbology_alternative"> {
    return {
      last_synced_at: sql`CURRENT_TIMESTAMP`
    };
  }
}
