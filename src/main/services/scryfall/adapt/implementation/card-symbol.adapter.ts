import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { sqliteUTCTimeStamp } from "../../../../../common/util";
import { DatabaseSchema } from "../../../../database/schema";
import { IScryfallCardSymbolDto } from "../../dto";
import { ICardSymbolAdapter } from "../interface";
import { scryfallBooleanToNumber } from "./utils";

export class CardSymbolAdapter implements ICardSymbolAdapter {
  public toInsert(cardSymbol: IScryfallCardSymbolDto): InsertExpression<DatabaseSchema, "card_symbol"> {
    const now = sqliteUTCTimeStamp();
    return {
      created_at: now,
      last_synced_at: now,
      id: cardSymbol.symbol,
      is_appears_in_mana_costs: scryfallBooleanToNumber(cardSymbol.appears_in_mana_costs),
      cmc: cardSymbol.mana_value,
      english: cardSymbol.english,
      is_funny: scryfallBooleanToNumber(cardSymbol.funny),
      is_hybrid: scryfallBooleanToNumber(cardSymbol.hybrid),
      loose_variant: cardSymbol.loose_variant,
      mana_value: cardSymbol.mana_value,
      is_phyrexian: scryfallBooleanToNumber(cardSymbol.phyrexian),
      is_represents_mana: scryfallBooleanToNumber(cardSymbol.represents_mana),
      svg_uri: cardSymbol.svg_uri,
      is_transposable: scryfallBooleanToNumber(cardSymbol.transposable)
    };
  }

  public toUpdate(cardSymbol: IScryfallCardSymbolDto): UpdateObjectExpression<DatabaseSchema, "card_symbol"> {
    return {
      is_appears_in_mana_costs: scryfallBooleanToNumber(cardSymbol.appears_in_mana_costs),
      cmc: cardSymbol.mana_value,
      english: cardSymbol.english,
      is_funny: scryfallBooleanToNumber(cardSymbol.funny),
      is_hybrid: scryfallBooleanToNumber(cardSymbol.hybrid),
      last_synced_at: sqliteUTCTimeStamp(),
      loose_variant: cardSymbol.loose_variant,
      mana_value: cardSymbol.mana_value,
      is_phyrexian: scryfallBooleanToNumber(cardSymbol.phyrexian),
      is_represents_mana: scryfallBooleanToNumber(cardSymbol.represents_mana),
      svg_uri: cardSymbol.svg_uri,
      is_transposable: scryfallBooleanToNumber(cardSymbol.transposable)
    };
  }
}
