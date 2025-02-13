import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { DatabaseSchema } from "../../../../../main/database/schema";
import { IOracleAdapter } from "../interface";
import { OracleAdapterParameter } from "../interface/param";
import { sqliteUTCTimeStamp } from "../../../../../common/util";

export class OracleAdapter implements IOracleAdapter {
  public toInsert(scryfall: OracleAdapterParameter): InsertExpression<DatabaseSchema, "oracle"> {
    const now = sqliteUTCTimeStamp;

    if (scryfall.scryfallCard) {
      return {
        created_at: now,
        last_synced_at: now,
        face_sequence: scryfall.sequence,
        oracle_id: scryfall.scryfallCard.oracle_id,
        oracle_name: scryfall.scryfallCard.name,
        oracle_text: scryfall.scryfallCard.oracle_text,
        type_line: scryfall.scryfallCard.type_line
      };
    } else {
      return {
        created_at: now,
        last_synced_at: now,
        face_sequence: scryfall.sequence,
        oracle_id: scryfall.oracleId,
        oracle_name: scryfall.scryfallCardFace.name,
        oracle_text: scryfall.scryfallCardFace.oracle_text,
        type_line: scryfall.scryfallCardFace.type_line
      };
    }
  }

  public toUpdate(scryfall: OracleAdapterParameter): UpdateObjectExpression<DatabaseSchema, "oracle"> {
    const now = sqliteUTCTimeStamp;
    if (scryfall.scryfallCard) {
      return {
        oracle_name: scryfall.scryfallCard.name,
        oracle_text: scryfall.scryfallCard.oracle_text,
        type_line: scryfall.scryfallCard.type_line,
        last_synced_at: now
      };
    } else {
      return {
        oracle_name: scryfall.scryfallCardFace.name,
        oracle_text: scryfall.scryfallCardFace.oracle_text,
        type_line: scryfall.scryfallCardFace.type_line,
        last_synced_at: now
      };
    }
  }
}
