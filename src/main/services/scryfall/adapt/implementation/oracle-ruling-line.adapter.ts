import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { DatabaseSchema } from "../../../../database/schema";
import { IOracleRulingLineAdapter } from "../interface";
import { ScryfallRuling } from "../../types";
import { scryfallDateToIsoString } from "./utils";

export class OracleRulingLineAdapter implements IOracleRulingLineAdapter {
  public toInsert(scryfall: ScryfallRuling): InsertExpression<DatabaseSchema, "oracle_ruling_line"> {
    return {
      oracle_id: scryfall.oracle_id,
      source: scryfall.source,
      comments: scryfall.comment,
      published_at: scryfallDateToIsoString(scryfall.published_at)
    };
  }

  public toUpdate(): UpdateObjectExpression<DatabaseSchema, "oracle_ruling_line"> {
    throw new Error("Method not supported");
  }
}
