import { sql } from "kysely";
import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";
import { Color } from "scryfall-sdk";

import { CardColorType, MTGColor } from "../../../../../common/enums";
import { DatabaseSchema } from "../../../../database/schema";
import { ICardfaceColorMapAdapter } from "../interface";

export class CardfaceColorMapAdapter implements ICardfaceColorMapAdapter{
  public toInsert(leftId: string, rigthId: string, scryfall: Color): InsertExpression<DatabaseSchema, "cardface_color_map"> {
    return {
      cardface_id: leftId,
      color_id: rigthId as MTGColor,
      color_type: scryfall as CardColorType
    };

  }
  public toUpdate(): UpdateObjectExpression<DatabaseSchema, "cardface_color_map"> {
    return {
      last_synced_at: sql`CURRENT_TIMESTAMP`
    };
  }

}
