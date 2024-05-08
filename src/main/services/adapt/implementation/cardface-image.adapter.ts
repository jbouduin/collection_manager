import { sql } from "kysely";
import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { ImageType } from "../../../../common/enums";
import { DatabaseSchema } from "../../../database/schema";
import { ICardfaceImageAdapter } from "../interfaces";

export class CardFaceImageAdapter implements ICardfaceImageAdapter {
  public toInsert(cardfaceId: string, scryfall: { type: ImageType, uri: string }): InsertExpression<DatabaseSchema, "cardface_image"> {
    return {
      cardface_id: cardfaceId,
      image_type: scryfall.type,
      uri: scryfall.uri
    };
  }

  public toUpdate(scryfall: { type: ImageType, uri: string }): UpdateObjectExpression<DatabaseSchema, "cardface_image"> {
    return {
      uri: scryfall.uri,
      last_synced_at: sql`CURRENT_TIMESTAMP`
    };
  }
}
