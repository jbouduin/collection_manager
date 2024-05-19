import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { DatabaseSchema } from "../../../../database/schema";
import { IRulingLineAdapter } from "../interface";
import { ScryfallRuling } from "../../types";

export class RulingLineAdapter implements IRulingLineAdapter {
  public toInsert(oracleId: string, scryfall: ScryfallRuling): InsertExpression<DatabaseSchema, "ruling_line"> {
    return {
      oracle_id: oracleId,
      source: scryfall.source,
      comments: scryfall.comment,
      published_at: `${scryfall.published_at} 00:00:00`
    };
  }

  public toUpdate(): UpdateObjectExpression<DatabaseSchema, "ruling_line"> {
    throw new Error("Not supported");
  }
}
