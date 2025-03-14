import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { DatabaseSchema } from "../../../../database/schema";
import { IScryfallRelatedCardDto } from "../../dto";
import { ICardCardMapAdapter } from "../interface";
import { CardCardMapAdapterParameter } from "../interface/param";

export class CardCardMapAdapter implements ICardCardMapAdapter {
  public toInsert(scryfall: CardCardMapAdapterParameter): InsertExpression<DatabaseSchema, "card_card_map"> {
    return scryfall.relatedCards.map((relatedCard: IScryfallRelatedCardDto) => {
      return {
        card_id: scryfall.cardId,
        component: relatedCard.component,
        related_card_id: relatedCard.id
      };
    });
  }

  public toUpdate(_scryfall: CardCardMapAdapterParameter): UpdateObjectExpression<DatabaseSchema, "card_card_map"> {
    throw new Error("Method not supported.");
  }
}
