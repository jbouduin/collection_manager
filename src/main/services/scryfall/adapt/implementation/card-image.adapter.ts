import { sql } from "kysely";
import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { ImageType } from "../../../../../common/enums";
import { DatabaseSchema } from "../../../../database/schema";
import { ICardImageAdapter } from "../interface";

export class CardImageAdapter implements ICardImageAdapter {
  public toInsert(cardId: string, scryfall: { type: ImageType, uri: string }): InsertExpression<DatabaseSchema, "card_image"> {
    return {
      card_id: cardId,
      image_type: scryfall.type,
      uri: scryfall.uri
    };
  }

  public toUpdate(scryfall: { type: ImageType, uri: string }): UpdateObjectExpression<DatabaseSchema, "card_image"> {
    return {
      uri: scryfall.uri,
      last_synced_at: sql`CURRENT_TIMESTAMP`
    };
  }
}
