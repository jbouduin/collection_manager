import { sql } from "kysely";
import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { DatabaseSchema } from "../../../../database/schema";
import { CardMultiversIdAdapterParameter, ICardMultiverseIdAdapter } from "../interface";

export class CardMultiverseIdAdapter implements ICardMultiverseIdAdapter {
  public toInsert(scryfall: CardMultiversIdAdapterParameter): InsertExpression<DatabaseSchema, "card_multiverse_id"> {
    return scryfall.multiverseIds.map((multiverseId: number) => {
      return {
        card_id: scryfall.card_id,
        multiverse_id: multiverseId
      }
    });
  }

  public toUpdate(_scryfall: CardMultiversIdAdapterParameter): UpdateObjectExpression<DatabaseSchema, "card_multiverse_id"> {
    throw new Error("Method not supported.");
  }
}
