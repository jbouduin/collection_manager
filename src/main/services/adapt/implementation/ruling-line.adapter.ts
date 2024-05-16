import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";
import { Ruling as ScryfallRuling } from "scryfall-sdk";

import { RulingSource } from "../../../../common/enums";
import { DatabaseSchema } from "../../../database/schema";
import { IRulingLineAdapter } from "../interfaces";

export class RulingLineAdapter implements IRulingLineAdapter {
  public toInsert(oracleId: string, scryfall: ScryfallRuling): InsertExpression<DatabaseSchema, "ruling_line"> {
    return {
      // FEATURE replace scryfall-sdk: the sdk has the property not defined!
      oracle_id: oracleId,
      source: scryfall.source as RulingSource,
      comments: scryfall.comment,
      published_at: `${scryfall.published_at} 00:00:00`
    };
  }

  public toUpdate(): UpdateObjectExpression<DatabaseSchema, "ruling_line"> {
    throw new Error("Not supported");
  }
}
