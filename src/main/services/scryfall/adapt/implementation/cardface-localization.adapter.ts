import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { DatabaseSchema } from "../../../../../main/database/schema";
import { CardfaceLocalizationAdapterParameter, ICardfaceLocalizationAdapter } from "../interface";

export class CardfaceLocalizationAdapter implements ICardfaceLocalizationAdapter {
  public toInsert(scryfall: CardfaceLocalizationAdapterParameter): InsertExpression<DatabaseSchema, "cardface_localization"> {
    return {
      id: scryfall.uuid,
      cardface_id: scryfall.cardfaceId,
      lang: scryfall.scryfallCard.lang,
      flavor_name: scryfall.scryfallCard.flavor_name,
      flavor_text: scryfall.scryfallCard.flavor_text,
      frame: scryfall.scryfallCard.frame,
      printed_name: scryfall.scryfallCard.printed_name ?? scryfall.scryfallCard.name, // because scryfall does not return this for "en"
      printed_text: scryfall.scryfallCard.printed_text ?? scryfall.scryfallCard.oracle_text,
      printed_type_line: scryfall.scryfallCard.printed_type_line ?? scryfall.scryfallCard.type_line
    }
  }

  public toUpdate(_scryfall: CardfaceLocalizationAdapterParameter): UpdateObjectExpression<DatabaseSchema, "cardface_localization"> {
    throw new Error("Method not supported.");
  }

}
