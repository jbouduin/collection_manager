import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";
import { Card as ScryFallCard } from "scryfall-sdk";

import { DatabaseSchema } from "../../../../main/database/schema";
import { ICardAdapter } from "../interfaces/card.adapter";

export class CardAdapter implements ICardAdapter {
  public toInsert(scryFall: ScryFallCard): InsertExpression<DatabaseSchema, "card"> {
    throw new Error("Method not implemented.");
  }

  public toUpdate(scryFall: ScryFallCard): UpdateObjectExpression<DatabaseSchema, "card"> {
    throw new Error("Method not implemented.");
  }
}
