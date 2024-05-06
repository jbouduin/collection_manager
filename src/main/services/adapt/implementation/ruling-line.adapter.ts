import { sql } from "kysely";
import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";
import { Ruling as ScryfallRuling } from "scryfall-sdk";

import { RulingSource } from "../../../../common/enums";
import { DatabaseSchema } from "../../../database/schema";
import { IRulingLineAdapter } from "../interfaces";

export class RulingLineAdapter implements IRulingLineAdapter {
  public toInsert(oracleId: string, scryfall: ScryfallRuling): InsertExpression<DatabaseSchema, "ruling_line"> {
    return {
      // TODO the sdk has the property not defined!
      oracle_id: oracleId,
      source: scryfall.source as RulingSource,
      comments: scryfall.comment,
      published_at: scryfall.published_at
    };
  }

  public toUpdate(): UpdateObjectExpression<DatabaseSchema, "ruling_line"> {
    // TODO throw exception, as ruling lines should never be updated (they have no PK)
    return {
      last_synced_at: sql`CURRENT_TIMESTAMP`
    };
  }
}
