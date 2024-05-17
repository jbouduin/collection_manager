import { sql } from "kysely";
import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { DatabaseSchema } from "../../../../database/schema";
import { IRulingAdapter } from "../interface";

export class RulingAdapter implements IRulingAdapter {
  public toInsert(oracleId: string): InsertExpression<DatabaseSchema, "ruling"> {
    return {
      oracle_id: oracleId
    };
  }

  public toUpdate(): UpdateObjectExpression<DatabaseSchema, "ruling"> {
    return {
      last_synced_at: sql`CURRENT_TIMESTAMP`
    };
  }
}
