import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { DatabaseSchema } from "../../../../database/schema";
import { ICardfaceAdapter } from "../interface";
import { CardFaceAdapterParameter } from "../interface/param";
import { ScryfallCard, ScryfallCardface } from "../../types";

export class CardfaceAdapter implements ICardfaceAdapter {
  //#region ICardFaceAdapter methods ------------------------------------------
  public toInsert(scryfall: CardFaceAdapterParameter): InsertExpression<DatabaseSchema, "cardface"> {
    if (scryfall.scryfallCardfaces) {
      return this.toInsertMultipleCardFaces(scryfall.scryfallCard.id, scryfall.scryfallCardfaces);
    } else {
      return this.toInsertSingleCardFace(scryfall.scryfallCard);
    }
  }

  public toUpdate(_scryfall: CardFaceAdapterParameter): UpdateObjectExpression<DatabaseSchema, "cardface"> {
    throw new Error("Method not supported");
  }
  //#region

  //#region Private methods ---------------------------------------------------
  private toInsertSingleCardFace(scryfallCard: ScryfallCard): InsertExpression<DatabaseSchema, "cardface"> {
    return {
      card_id: scryfallCard.id,
      sequence: 0,
      face_name: scryfallCard.name,
      artist: scryfallCard.artist,
      cmc: scryfallCard.cmc,
      defense: scryfallCard.defense,
      flavor_name: scryfallCard.flavor_name,
      flavor_text: scryfallCard.flavor_text,
      illustration_id: scryfallCard.illustration_id,
      layout: scryfallCard.layout,
      loyalty: scryfallCard.loyalty,
      mana_cost: scryfallCard.mana_cost,
      oracle_id: scryfallCard.oracle_id,
      power: scryfallCard.power,
      printed_name: scryfallCard.printed_name ?? scryfallCard.name, // because scryfall does not return this for "en"
      printed_text: scryfallCard.printed_text ?? scryfallCard.oracle_text,
      printed_type_line: scryfallCard.printed_type_line ?? scryfallCard.type_line,
      toughness: scryfallCard.toughness,
      watermark: scryfallCard.watermark
    };
  }

  private toInsertMultipleCardFaces(cardId: string, cardfaces: Array<ScryfallCardface>): InsertExpression<DatabaseSchema, "cardface"> {
    const result = new Array<InsertExpression<DatabaseSchema, "cardface">>();
    cardfaces.map((cardface: ScryfallCardface, idx: number) => {
      result.push({
        card_id: cardId,
        sequence: idx,
        face_name: cardface.name,
        artist: cardface.artist,
        cmc: cardface.cmc,
        defense: cardface.defense,
        flavor_name: cardface.flavor_name,
        flavor_text: cardface.flavor_text,
        illustration_id: cardface.illustration_id,
        layout: cardface.layout,
        loyalty: cardface.loyalty,
        mana_cost: cardface.mana_cost,
        oracle_id: cardface.oracle_id,
        power: cardface.power,
        /*
         *  for "en" scryfall does not return printed fields so we use the name
         * for split in other languages printed_name is wrong also
         */
        printed_name: cardface.printed_name ?? cardface.name,
        printed_text: cardface.printed_text ?? cardface.oracle_text,
        printed_type_line: cardface.printed_type_line ?? cardface.type_line,
        toughness: cardface.toughness,
        watermark: cardface.watermark
      });
    });
    return result;
  }
  //#endregion
}
