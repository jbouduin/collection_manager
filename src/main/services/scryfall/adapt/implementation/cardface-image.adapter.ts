import { sql } from "kysely";
import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { ImageSize } from "../../../../../common/enums";
import { DatabaseSchema } from "../../../../database/schema";
import { ICardfaceImageAdapter } from "../interface";

export class CardFaceImageAdapter implements ICardfaceImageAdapter {
  public toInsert(cardfaceId: string, scryfall: { type: ImageSize, uri: string }): InsertExpression<DatabaseSchema, "cardface_image"> {
    return {
      cardface_id: cardfaceId,
      image_type: scryfall.type,
      uri: scryfall.uri
    };
  }

  public toUpdate(scryfall: { type: ImageSize, uri: string }): UpdateObjectExpression<DatabaseSchema, "cardface_image"> {
    return {
      uri: scryfall.uri,
      last_synced_at: sql`CURRENT_TIMESTAMP`
    };
  }
}
