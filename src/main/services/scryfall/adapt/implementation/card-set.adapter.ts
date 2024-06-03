import { sql } from "kysely";
import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { DatabaseSchema } from "../../../../database/schema";
import { ScryfallCardSet } from "../../types";
import { ICardSetAdapter } from "../interface";

export class CardSetAdapter implements ICardSetAdapter {

  //#region ICardSetAdapter ---------------------------------------------------
  public toInsert(cardSet: ScryfallCardSet): InsertExpression<DatabaseSchema, "card_set"> {
    return {
      arena_code: cardSet.arena_code,
      block: cardSet.block,
      block_code: cardSet.block_code,
      card_count: cardSet.card_count,
      code: cardSet.code,
      digital: cardSet.digital ? 1 : 0,
      foil_only: cardSet.foil_only ? 1 : 0,
      icon_svg_uri: cardSet.icon_svg_uri,
      mtgo_code: cardSet.mtgo_code,
      name: cardSet.name,
      nonfoil_only: cardSet.nonfoil_only ? 1 : 0,
      parent_set_code: cardSet.parent_set_code,
      printed_size: cardSet.printed_size,
      id: cardSet.id,
      released_at: cardSet.released_at,
      scryfall_uri: cardSet.scryfall_uri,
      search_uri: cardSet.search_uri,
      set_type: cardSet.set_type,
      tcgplayer_id: cardSet.tcgplayer_id,
      uri: cardSet.uri,
      last_full_synchronization: null
    };
  }

  public toUpdate(cardSet: ScryfallCardSet): UpdateObjectExpression<DatabaseSchema, "card_set"> {
    return {
      arena_code: cardSet.arena_code,
      block: cardSet.block,
      block_code: cardSet.block_code,
      card_count: cardSet.card_count,
      digital: cardSet.digital ? 1 : 0,
      foil_only: cardSet.foil_only ? 1 : 0,
      icon_svg_uri: cardSet.icon_svg_uri,
      mtgo_code: cardSet.mtgo_code,
      name: cardSet.name,
      nonfoil_only: cardSet.nonfoil_only ? 1 : 0,
      parent_set_code: cardSet.parent_set_code,
      printed_size: cardSet.printed_size,
      released_at: cardSet.released_at,
      scryfall_uri: cardSet.scryfall_uri,
      search_uri: cardSet.search_uri,
      set_type: cardSet.set_type,
      tcgplayer_id: cardSet.tcgplayer_id,
      uri: cardSet.uri,
      last_synced_at: sql`CURRENT_TIMESTAMP`,
      // last_full_synchronization => we do not overwrite this column
    };
  }
  //#endregion

}
