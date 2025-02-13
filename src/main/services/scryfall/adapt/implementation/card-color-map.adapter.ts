import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { MTGColor } from "../../../../../common/enums";
import { DatabaseSchema } from "../../../../database/schema";
import { ICardColorMapAdapter } from "../interface";
import { CardColorMapAdapterParameter } from "../interface/param";

export class CardColorMapAdapter implements ICardColorMapAdapter {
  public toInsert(scryfall: CardColorMapAdapterParameter): InsertExpression<DatabaseSchema, "card_color_map"> {
    return scryfall.colors.map((color: MTGColor) => {
      return {
        card_id: scryfall.cardId,
        color_type: scryfall.colorType,
        color_id: color
      };
    });
  }

  public toUpdate(_scryfall: CardColorMapAdapterParameter): UpdateObjectExpression<DatabaseSchema, "card_color_map"> {
    throw new Error("Method not supported.");
  }
}
