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
      layout: scryfall.layout,
      oracle_id: scryfall.oracle_id,
      scryfall_uri: scryfall.scryfall_uri,
      booster: scryfall.booster ? 0 : 1,
      border: scryfall.border_color,
      card_back_id: scryfall.card_back_id,
      collector_number: scryfall.collector_number,
      content_warning: scryfall.content_warning ? 0 : 1,
      digital: scryfall.digital ? 0 : 1,
      full_art: scryfall.full_art ? 0 : 1,
      rarity: scryfall.rarity,
      released_at: scryfall.released_at,
      reprint: scryfall.reprint ? 0 : 1,
      set_id: scryfall.set_id
    };
  }

  public toUpdate(scryfall: ScryfallCard): UpdateObjectExpression<DatabaseSchema, "card"> {
    return {
      oracle_id: scryfall.oracle_id,
      scryfall_uri: scryfall.scryfall_uri,
      booster: scryfall.booster ? 0 : 1,
      border: scryfall.border_color,
      card_back_id: scryfall.card_back_id,
      collector_number: scryfall.collector_number,
      content_warning: scryfall.content_warning ? 0 : 1,
      digital: scryfall.digital ? 0 : 1,
      full_art: scryfall.full_art ? 0 : 1,
      rarity: scryfall.rarity,
      released_at: scryfall.released_at,
      reprint: scryfall.reprint ? 0 : 1,
      set_id: scryfall.set_id,
      last_synced_at: sql`CURRENT_TIMESTAMP`
    };
  }
}
