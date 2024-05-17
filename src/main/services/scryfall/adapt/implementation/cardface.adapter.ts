import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";
import { CardFace as ScryFallCardface } from "scryfall-sdk";
import { v1 as uuidV1 } from "uuid";

import { sql } from "kysely";
import { CardLayout } from "../../../../../common/enums";
import { DatabaseSchema } from "../../../../database/schema";
import { ICardfaceAdapter } from "../interface";

export class CardfaceAdapter implements ICardfaceAdapter {

  public toInsert(cardId: string, scryfall: ScryFallCardface): InsertExpression<DatabaseSchema, "cardface"> {
    // FEATURE replace scryfall-sdk: ScryFallCardface has prototype card and cards that return from scryfall with no cardface get an empty card-face object by default
    return {
      id: uuidV1(),
      artist: scryfall.artist,
      artist_id: scryfall.artist_id,
      card_id: cardId,
      cmc: scryfall.cmc,
      defense: scryfall.defense,
      flavor_text: scryfall.flavor_text,
      illustration_id: scryfall.illustration_id,
      layout: scryfall.layout as CardLayout, // FEATURE replace scryfall-sdk:  check, because this is not as expected
      loyalty: scryfall.loyalty,
      mana_cost: scryfall.mana_cost,
      name: scryfall.name,
      oracle_id: scryfall.oracle_id,
      oracle_text: scryfall.oracle_text,
      power: scryfall.power,
      printed_name: scryfall.printed_name,
      printed_text: scryfall.printed_text,
      printed_type_line: scryfall.printed_type_line,
      toughness: scryfall.toughness,
      type_line: scryfall.type_line,
      watermark: scryfall.watermark
    };
  }

  public toUpdate(scryfall: ScryFallCardface): UpdateObjectExpression<DatabaseSchema, "cardface"> {
    return {
      artist: scryfall.artist,
      artist_id: scryfall.artist_id,
      cmc: scryfall.cmc,
      defense: scryfall.defense,
      flavor_text: scryfall.flavor_text,
      illustration_id: scryfall.illustration_id,
      layout: scryfall.layout as CardLayout,
      loyalty: scryfall.loyalty,
      mana_cost: scryfall.mana_cost,
      name: scryfall.name,
      oracle_id: scryfall.oracle_id,
      oracle_text: scryfall.oracle_text,
      power: scryfall.power,
      printed_name: scryfall.printed_name,
      printed_text: scryfall.printed_text,
      printed_type_line: scryfall.printed_type_line,
      toughness: scryfall.toughness,
      type_line: scryfall.type_line,
      watermark: scryfall.watermark,
      last_synced_at: sql`CURRENT_TIMESTAMP`
    };
  }
}
