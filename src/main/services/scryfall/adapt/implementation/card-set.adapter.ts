import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { sqliteUTCTimeStamp } from "../../../../../common/util";
import { DatabaseSchema } from "../../../../database/schema";
import { IScryfallCardSetDto } from "../../dto";
import { ICardSetAdapter } from "../interface";
import { scryfallBooleanToNumber, scryfallDateToIsoString } from "./utils";

export class CardSetAdapter implements ICardSetAdapter {
  //#region ICardSetAdapter ---------------------------------------------------
  public toInsert(scryfall: IScryfallCardSetDto): InsertExpression<DatabaseSchema, "card_set"> {
    const now = sqliteUTCTimeStamp();
    return {
      created_at: now,
      last_synced_at: now,
      arena_code: scryfall.arena_code,
      block: scryfall.block,
      block_code: scryfall.block_code,
      card_count: scryfall.card_count,
      code: scryfall.code,
      is_digital: scryfallBooleanToNumber(scryfall.digital),
      is_foil_only: scryfallBooleanToNumber(scryfall.foil_only),
      icon_svg_uri: scryfall.icon_svg_uri,
      mtgo_code: scryfall.mtgo_code,
      name: scryfall.name,
      is_nonfoil_only: scryfallBooleanToNumber(scryfall.nonfoil_only),
      parent_set_code: scryfall.parent_set_code,
      printed_size: scryfall.printed_size,
      id: scryfall.id,
      released_at: scryfallDateToIsoString(scryfall.released_at),
      scryfall_uri: scryfall.scryfall_uri,
      search_uri: scryfall.search_uri,
      set_type: scryfall.set_type,
      tcgplayer_id: scryfall.tcgplayer_id,
      uri: scryfall.uri,
      last_full_synchronization_at: null
    };
  }

  public toUpdate(scryfall: IScryfallCardSetDto): UpdateObjectExpression<DatabaseSchema, "card_set"> {
    return {
      arena_code: scryfall.arena_code,
      block: scryfall.block,
      block_code: scryfall.block_code,
      card_count: scryfall.card_count,
      is_digital: scryfallBooleanToNumber(scryfall.digital),
      is_foil_only: scryfallBooleanToNumber(scryfall.foil_only),
      icon_svg_uri: scryfall.icon_svg_uri,
      mtgo_code: scryfall.mtgo_code,
      name: scryfall.name,
      is_nonfoil_only: scryfallBooleanToNumber(scryfall.nonfoil_only),
      parent_set_code: scryfall.parent_set_code,
      printed_size: scryfall.printed_size,
      released_at: scryfallDateToIsoString(scryfall.released_at),
      scryfall_uri: scryfall.scryfall_uri,
      search_uri: scryfall.search_uri,
      set_type: scryfall.set_type,
      tcgplayer_id: scryfall.tcgplayer_id,
      uri: scryfall.uri,
      last_synced_at: sqliteUTCTimeStamp()
      // last_full_synchronization_at => we do not overwrite this column
    };
  }
  //#endregion
}
