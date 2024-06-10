import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { DatabaseSchema } from "../../../../database/schema";
import { ScryfallCard } from "../../types";
import { ICardAdapter } from "../interface";
import { scryfallBooleanToNumber, scryfallDateToIsoString } from "./utils";
import { sqliteUTCTimeStamp } from "../../../../../common/util";

export class CardAdapter implements ICardAdapter {
  public toInsert(scryfall: ScryfallCard): InsertExpression<DatabaseSchema, "card"> {
    const now = sqliteUTCTimeStamp;
    return {
      created_at: now,
      last_synced_at: now,
      id: scryfall.id,
      name: scryfall.name,
      lang: scryfall.lang,
      layout: scryfall.layout,
      oracle_id: scryfall.oracle_id,
      scryfall_uri: scryfall.scryfall_uri,
      is_booster: scryfallBooleanToNumber(scryfall.booster),
      border: scryfall.border_color,
      card_back_id: scryfall.card_back_id,
      collector_number: scryfall.collector_number,
      is_content_warning: scryfallBooleanToNumber(scryfall.content_warning),
      is_digital: scryfallBooleanToNumber(scryfall.digital),
      frame: scryfall.frame,
      is_full_art: scryfallBooleanToNumber(scryfall.full_art),
      rarity: scryfall.rarity,
      released_at: scryfallDateToIsoString( scryfall.released_at),
      is_reprint: scryfallBooleanToNumber(scryfall.reprint),
      set_id: scryfall.set_id,
      is_oversized: scryfallBooleanToNumber(scryfall.oversized),
      is_reserved: scryfallBooleanToNumber(scryfall.reserved),
      is_promo: scryfallBooleanToNumber(scryfall.promo),
      is_story_spotlight: scryfallBooleanToNumber(scryfall.story_spotlight),
      image_status: scryfall.image_status,
      is_variation: scryfallBooleanToNumber(scryfall.variation),
      security_stamp: scryfall.security_stamp
    };
  }

  public toUpdate(scryfall: ScryfallCard): UpdateObjectExpression<DatabaseSchema, "card"> {
    return {
      name: scryfall.name,
      oracle_id: scryfall.oracle_id,
      scryfall_uri: scryfall.scryfall_uri,
      is_booster: scryfallBooleanToNumber(scryfall.booster),
      border: scryfall.border_color,
      card_back_id: scryfall.card_back_id,
      collector_number: scryfall.collector_number,
      is_content_warning: scryfallBooleanToNumber(scryfall.content_warning),
      is_digital: scryfallBooleanToNumber(scryfall.digital),
      frame: scryfall.frame,
      is_full_art: scryfallBooleanToNumber(scryfall.full_art),
      rarity: scryfall.rarity,
      released_at: scryfallDateToIsoString(scryfall.released_at),
      is_reprint: scryfallBooleanToNumber(scryfall.reprint),
      set_id: scryfall.set_id,
      is_oversized: scryfallBooleanToNumber(scryfall.oversized),
      is_reserved: scryfallBooleanToNumber(scryfall.reserved),
      is_promo: scryfallBooleanToNumber(scryfall.promo),
      last_synced_at: sqliteUTCTimeStamp,
      is_story_spotlight: scryfallBooleanToNumber(scryfall.story_spotlight),
      image_status: scryfall.image_status,
      is_variation: scryfallBooleanToNumber(scryfall.variation),
      security_stamp: scryfall.security_stamp
    };
  }
}
