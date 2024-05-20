import { sql } from "kysely";
import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { CardLegality, GameFormat } from "../../../../../common/enums";
import { DatabaseSchema } from "../../../../database/schema";
import { ICardFormatLegalityAdapter } from "../interface";

export class CardFormatLegalityAdapter implements ICardFormatLegalityAdapter {
  public toInsert(cardId: string, scryfall: { format: GameFormat, legality: CardLegality }): InsertExpression<DatabaseSchema, "card_format_legality"> {
    return {
      // card_id: cardId,
      format: scryfall.format,
      legality: scryfall.legality
    };
  }

  public toUpdate(scryfall: { format: GameFormat, legality: CardLegality }): UpdateObjectExpression<DatabaseSchema, "card_format_legality"> {
    return {
      legality: scryfall.legality,
      // last_synced_at: sql`CURRENT_TIMESTAMP`
    };
  }
}
