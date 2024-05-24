import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { MTGColor } from "../../../../../common/enums";
import { DatabaseSchema } from "../../../../database/schema";
import { ICardfaceColorMapAdapter } from "../interface";
import { CardfaceColorMapAdapterParameter } from "../interface/param";

export class CardfaceColorMapAdapter implements ICardfaceColorMapAdapter{
  public toInsert(scryfall: CardfaceColorMapAdapterParameter): InsertExpression<DatabaseSchema, "cardface_color_map"> {
    return scryfall.colors.map((color: MTGColor) => {
      return {
        cardface_id: scryfall.cardfaceId,
        color_type: scryfall.colorType,
        color_id: color
      };
    });

  }
  public toUpdate(_scryfall: CardfaceColorMapAdapterParameter): UpdateObjectExpression<DatabaseSchema, "cardface_color_map"> {
    throw new Error("Method not supported.");
  }

}
