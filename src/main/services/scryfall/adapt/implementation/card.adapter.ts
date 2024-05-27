import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { sql } from "kysely";
import { DatabaseSchema } from "../../../../database/schema";
import { ScryfallCard } from "../../types";
import { ICardAdapter } from "../interface";

export class CardAdapter implements ICardAdapter {
  public toInsert(scryfall: ScryfallCard): InsertExpression<DatabaseSchema, "card"> {
    return {
      id: scryfall.id,
      name: scryfall.name,
      lang: scryfall.lang,
      layout: scryfall.layout,
      oracle_id: scryfall.oracle_id,
      scryfall_uri: scryfall.scryfall_uri,
      booster: scryfall.booster ? 1 : 0,
      border: scryfall.border_color,
      card_back_id: scryfall.card_back_id,
      collector_number: scryfall.collector_number,
      content_warning: scryfall.content_warning ? 1 : 0,
      digital: scryfall.digital ? 1 : 0,
      frame: scryfall.frame,
      full_art: scryfall.full_art ? 1 : 0,
      rarity: scryfall.rarity,
      released_at: scryfall.released_at,
      reprint: scryfall.reprint ? 1 : 0,
      set_id: scryfall.set_id
    };
  }

  public toUpdate(scryfall: ScryfallCard): UpdateObjectExpression<DatabaseSchema, "card"> {
    return {
      name: scryfall.name,
      oracle_id: scryfall.oracle_id,
      scryfall_uri: scryfall.scryfall_uri,
      booster: scryfall.booster ? 1 : 0,
      border: scryfall.border_color,
      card_back_id: scryfall.card_back_id,
      collector_number: scryfall.collector_number,
      content_warning: scryfall.content_warning ? 1 : 0,
      digital: scryfall.digital ? 1 : 0,
      frame: scryfall.frame,
      full_art: scryfall.full_art ? 1 : 0,
      rarity: scryfall.rarity,
      released_at: scryfall.released_at,
      reprint: scryfall.reprint ? 1 : 0,
      set_id: scryfall.set_id,
      last_synced_at: sql`CURRENT_TIMESTAMP`
    };
  }
}
