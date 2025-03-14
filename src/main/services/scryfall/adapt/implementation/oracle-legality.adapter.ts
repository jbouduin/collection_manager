import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { sqliteUTCTimeStamp } from "../../../../../common/util";
import { DatabaseSchema } from "../../../../database/schema";
import { IOracleLegalityAdapter } from "../interface";
import { OracleLegalityAdapterParameter } from "../interface/param";

export class OracleLegalityAdapter implements IOracleLegalityAdapter {
  public toInsert(scryfall: OracleLegalityAdapterParameter): InsertExpression<DatabaseSchema, "oracle_legality"> {
    const now = sqliteUTCTimeStamp();
    return {
      created_at: now,
      last_synced_at: now,
      oracle_id: scryfall.oracle_id,
      format: scryfall.gameFormat,
      legality: scryfall.legality
    };
  }

  public toUpdate(scryfall: OracleLegalityAdapterParameter): UpdateObjectExpression<DatabaseSchema, "oracle_legality"> {
    return {
      legality: scryfall.legality,
      last_synced_at: sqliteUTCTimeStamp()
    };
  }
}
