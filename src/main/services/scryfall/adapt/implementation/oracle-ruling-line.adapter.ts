import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { DatabaseSchema } from "../../../../database/schema";
import { IOracleRulingLineAdapter } from "../interface";
import { ScryfallRuling } from "../../types";

export class OracleRulingLineAdapter implements IOracleRulingLineAdapter {
  public toInsert(oracleId: string, scryfall: ScryfallRuling): InsertExpression<DatabaseSchema, "oracle_ruling_line"> {
    return {
      oracle_id: oracleId,
      source: scryfall.source,
      comments: scryfall.comment,
      published_at: `${scryfall.published_at} 00:00:00`
    };
  }

  public toUpdate(): UpdateObjectExpression<DatabaseSchema, "oracle_ruling_line"> {
    throw new Error("Not supported");
  }
}
