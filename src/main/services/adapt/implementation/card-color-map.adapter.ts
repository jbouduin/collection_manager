import { sql } from "kysely";
import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";
import { Color } from "scryfall-sdk";

import { CardColorType, MTGColor } from "../../../../common/enums";
import { DatabaseSchema } from "../../../database/schema";
import { ICardColorMapAdapter } from "../interfaces";

export class CardColorMapAdapter implements ICardColorMapAdapter{
  public toInsert(leftId: string, rigthId: string, scryfall: Color): InsertExpression<DatabaseSchema, "card_color_map"> {
    return {
      card_id: leftId,
      color_id: rigthId as MTGColor,
      color_type: scryfall as CardColorType
    };

  }
  public toUpdate(): UpdateObjectExpression<DatabaseSchema, "card_color_map"> {
    return {
      last_synced_at: sql`CURRENT_TIMESTAMP`
    };
  }

}
