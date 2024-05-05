import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";
import { Card as ScryFallCard } from "scryfall-sdk";

import { DatabaseSchema } from "../../../../main/database/schema";
import { ICardAdapter } from "../interfaces/card.adapter";
import { MTGLanguage } from "../../../../common/enums";
import { sql } from "kysely";

export class CardAdapter implements ICardAdapter {
  public toInsert(scryfall: ScryFallCard): InsertExpression<DatabaseSchema, "card"> {
    return {
      arena_id: scryfall.arena_id,
      cardmarket_id: scryfall.cardmarket_id,
      id: scryfall.id,
      lang: scryfall.lang as MTGLanguage,
      layout: scryfall.layout,
      mtgo_foil_id: scryfall.mtgo_foil_id,
      mtgo_id: scryfall.mtgo_id,
      oracle_id: scryfall.oracle_id,
      prints_search_uri: scryfall.prints_search_uri,
      rulings_uri: scryfall.rulings_uri,
      scryfall_uri: scryfall.scryfall_uri,
      tcgplayer_etched_id: scryfall.tcgplayer_etched_id,
      tcgplayer_id: scryfall.tcgplayer_id,
      uri: scryfall.uri
    };
  }

  public toUpdate(scryfall: ScryFallCard): UpdateObjectExpression<DatabaseSchema, "card"> {
    return {
      arena_id: scryfall.arena_id,
      cardmarket_id: scryfall.cardmarket_id,
      mtgo_foil_id: scryfall.mtgo_foil_id,
      mtgo_id: scryfall.mtgo_id,
      oracle_id: scryfall.oracle_id,
      prints_search_uri: scryfall.prints_search_uri,
      rulings_uri: scryfall.rulings_uri,
      scryfall_uri: scryfall.scryfall_uri,
      tcgplayer_etched_id: scryfall.tcgplayer_etched_id,
      tcgplayer_id: scryfall.tcgplayer_id,
      uri: scryfall.uri,
      last_synced_at: sql`CURRENT_TIMESTAMP`
    };
  }
}
