import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { v1 as uuidV1 } from "uuid";

import { sql } from "kysely";
import { DatabaseSchema } from "../../../../database/schema";
import { ICardfaceAdapter } from "../interface";
import { ScryfallCardFace } from "../../types";

export class CardfaceAdapter implements ICardfaceAdapter {

  public toInsert(cardId: string, scryfall: ScryfallCardFace): InsertExpression<DatabaseSchema, "cardface"> {
    return {
      id: uuidV1(),
      artist: scryfall.artist,
      artist_id: scryfall.artist_id,
      card_id: cardId,
      cmc: scryfall.cmc,
      defense: scryfall.defense,
      flavor_text: scryfall.flavor_text,
      illustration_id: scryfall.illustration_id,
      layout: scryfall.layout,
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

  public toUpdate(scryfall: ScryfallCardFace): UpdateObjectExpression<DatabaseSchema, "cardface"> {
    return {
      artist: scryfall.artist,
      artist_id: scryfall.artist_id,
      cmc: scryfall.cmc,
      defense: scryfall.defense,
      flavor_text: scryfall.flavor_text,
      illustration_id: scryfall.illustration_id,
      layout: scryfall.layout,
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
