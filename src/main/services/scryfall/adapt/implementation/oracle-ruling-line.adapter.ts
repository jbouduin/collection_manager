import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { DatabaseSchema } from "../../../../database/schema";
import { IOracleRulingLineAdapter } from "../interface";
import { ScryfallRuling } from "../../types";

export class OracleRulingLineAdapter implements IOracleRulingLineAdapter {
  public toInsert(scryfall: ScryfallRuling): InsertExpression<DatabaseSchema, "oracle_ruling_line"> {
    return {
      oracle_id: scryfall.oracle_id,
      source: scryfall.source,
      comments: scryfall.comment,
      published_at: `${scryfall.published_at} 00:00:00` // NOW date and datetime issues: these times are probably GMT -08:00:00
    };
  }

  public toUpdate(): UpdateObjectExpression<DatabaseSchema, "oracle_ruling_line"> {
    throw new Error("Method not supported");
  }
}
