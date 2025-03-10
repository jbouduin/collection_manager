import { Expression, expressionBuilder, sql } from "kysely";
import { DatabaseSchema } from "../../../schema";


export function $deckSize(deckIdRef: Expression<number>) {
  const eb = expressionBuilder<DatabaseSchema, never>();
  return eb.fn
    .coalesce(
      eb.selectFrom("deck_card as dcd")
        .select((eb) => [eb.fn.sum<number>("dcd.deck_quantity").as("deckSize")])
        .whereRef("dcd.deck_id", "=", deckIdRef)
        .$castTo<number>(),
      sql<number>`0`
    );
}

export function $sideboardSize(deckIdRef: Expression<number>) {
  const eb = expressionBuilder<DatabaseSchema, never>();
  return eb.fn
    .coalesce(
      eb.selectFrom("deck_card as dcd")
        .select((eb) => [eb.fn.sum<number>("dcd.sideboard_quantity").as("sideboardSize")])
        .whereRef("dcd.deck_id", "=", deckIdRef)
        .$castTo<number>(),
      sql<number>`0`
    );
}
