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
      is_digital: cardSet.digital ? 1 : 0,
      is_foil_only: cardSet.foil_only ? 1 : 0,
      icon_svg_uri: cardSet.icon_svg_uri,
      mtgo_code: cardSet.mtgo_code,
      name: cardSet.name,
      is_nonfoil_only: cardSet.nonfoil_only ? 1 : 0,
      parent_set_code: cardSet.parent_set_code,
      printed_size: cardSet.printed_size,
      id: cardSet.id,
      released_at: cardSet.released_at,  // NOW date and datetime issues: these times are probably GMT -08:00:00
      scryfall_uri: cardSet.scryfall_uri,
      search_uri: cardSet.search_uri,
      set_type: cardSet.set_type,
      tcgplayer_id: cardSet.tcgplayer_id,
      uri: cardSet.uri,
      last_full_synchronization_at: null
    };
  }

  public toUpdate(cardSet: ScryfallCardSet): UpdateObjectExpression<DatabaseSchema, "card_set"> {
    return {
      arena_code: cardSet.arena_code,
      block: cardSet.block,
      block_code: cardSet.block_code,
      card_count: cardSet.card_count,
      is_digital: cardSet.digital ? 1 : 0,
      is_foil_only: cardSet.foil_only ? 1 : 0,
      icon_svg_uri: cardSet.icon_svg_uri,
      mtgo_code: cardSet.mtgo_code,
      name: cardSet.name,
      is_nonfoil_only: cardSet.nonfoil_only ? 1 : 0,
      parent_set_code: cardSet.parent_set_code,
      printed_size: cardSet.printed_size,
      released_at: cardSet.released_at, // NOW date and datetime issues: these times are probably GMT -08:00:00
      scryfall_uri: cardSet.scryfall_uri,
      search_uri: cardSet.search_uri,
      set_type: cardSet.set_type,
      tcgplayer_id: cardSet.tcgplayer_id,
      uri: cardSet.uri,
      last_synced_at: sql`CURRENT_TIMESTAMP`,
      // last_full_synchronization_at => we do not overwrite this column
    };
  }
  //#endregion

}
