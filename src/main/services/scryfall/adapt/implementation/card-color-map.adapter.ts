import { sql } from "kysely";
import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { MTGColorType, MTGColor } from "../../../../../common/enums";
import { DatabaseSchema } from "../../../../database/schema";
import { ICardColorMapAdapter } from "../interface";

export class CardColorMapAdapter implements ICardColorMapAdapter{
  public toInsert(leftId: string, rigthId: string, scryfall: MTGColor): InsertExpression<DatabaseSchema, "card_color_map"> {
    return {
      card_id: leftId,
      color_id: rigthId as MTGColor,
      color_type: scryfall as MTGColorType // NOW manacolor has one more value "Colorless"
    };

  }
  public toUpdate(): UpdateObjectExpression<DatabaseSchema, "card_color_map"> {
    return {
      last_synced_at: sql`CURRENT_TIMESTAMP`
    };
  }

}
