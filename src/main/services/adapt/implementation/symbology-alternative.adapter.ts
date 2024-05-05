import { sql } from "kysely";
import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { DatabaseSchema } from "../../../../main/database/schema";
import { ISymbologyAlternativeAdapter } from "../interfaces";


export class SymbologyAlternativeAdapter implements ISymbologyAlternativeAdapter {
  public toInsert(symbologyId: string, alternative: string): InsertExpression<DatabaseSchema, "symbology_alternative"> {
    return {
      symbology_id: symbologyId,
      alternative: alternative,
    };
  }

  public toUpdate(): UpdateObjectExpression<DatabaseSchema, "symbology_alternative"> {
    return {
      last_synced_at: sql`CURRENT_TIMESTAMP`
    };
  }
}
