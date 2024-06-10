import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { sqliteUTCTimeStamp } from "../../../../../common/util";
import { DatabaseSchema } from "../../../../database/schema";
import { IOracleRulingAdapter } from "../interface";

export class OracleRulingAdapter implements IOracleRulingAdapter {
  public toInsert(oracleId: string): InsertExpression<DatabaseSchema, "oracle_ruling"> {
    const now = sqliteUTCTimeStamp;
    return {
      created_at: now,
      last_synced_at: now,
      oracle_id: oracleId
    };
  }

  public toUpdate(): UpdateObjectExpression<DatabaseSchema, "oracle_ruling"> {
    return {
      last_synced_at: sqliteUTCTimeStamp
    };
  }
}
