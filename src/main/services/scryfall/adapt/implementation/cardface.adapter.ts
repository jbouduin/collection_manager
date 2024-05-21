import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { DatabaseSchema } from "../../../../database/schema";
import { ICardfaceAdapter } from "../interface";
import { CardFaceAdapterParameter } from "../interface/param";

export class CardfaceAdapter implements ICardfaceAdapter {

  public toInsert(scryfall: CardFaceAdapterParameter): InsertExpression<DatabaseSchema, "cardface"> {
    // the result will later depend on the layout of the card
    return {
      id: scryfall.uuid,
      card_id: scryfall.scryfallCard.id,
      face_name: scryfall.faceName,
      artist: scryfall.scryfallCard.artist,
      cmc: scryfall.scryfallCard.cmc,
      defense: scryfall.scryfallCard.defense,
      illustration_id: scryfall.scryfallCard.illustration_id,
      layout: scryfall.scryfallCard.layout,
      loyalty: scryfall.scryfallCard.loyalty,
      mana_cost: scryfall.scryfallCard.mana_cost,
      oracle_id: scryfall.scryfallCard.oracle_id,
      power: scryfall.scryfallCard.power,
      toughness: scryfall.scryfallCard.toughness,
      watermark: scryfall.scryfallCard.watermark
    };
  }

  public toUpdate(scryfall: CardFaceAdapterParameter): UpdateObjectExpression<DatabaseSchema, "cardface"> {
    return {
      artist: scryfall.scryfallCard.artist,
      cmc: scryfall.scryfallCard.cmc,
      defense: scryfall.scryfallCard.defense,
      illustration_id: scryfall.scryfallCard.illustration_id,
      layout: scryfall.scryfallCard.layout,
      loyalty: scryfall.scryfallCard.loyalty,
      mana_cost: scryfall.scryfallCard.mana_cost,
      oracle_id: scryfall.scryfallCard.oracle_id,
      power: scryfall.scryfallCard.power,
      toughness: scryfall.scryfallCard.toughness,
      watermark: scryfall.scryfallCard.watermark
    };
  }
}
