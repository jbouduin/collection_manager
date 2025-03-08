import { ColumnDefinitionBuilder, Insertable, Kysely } from "kysely";
import { sqliteUTCTimeStamp } from "../../../../../common/util";
import { CardConditionTable } from "../../../schema";
import { createTable, CreateTableOptions, IBaseMigration } from "../../base-migration";

/* eslint-disable  @typescript-eslint/no-explicit-any */
export class V1_0_0_CardCondition_Migration implements IBaseMigration {
  get keyName(): string {
    return "0005: v.1.0.0.CardCondition";
  }

  public up(db: Kysely<any>): Promise<void> {
    return createV1_0_0_CardCondition(db)
      .then(() => populateV1_0_0_CardCondition(db))
      .then(() => Promise.resolve());
  }
  down(db: Kysely<any>): Promise<void> {
    return db.schema.dropTable("card_condition").execute();
  }
}

// NOW move to master data
function createV1_0_0_CardCondition(db: Kysely<any>): Promise<void> {
  const options: CreateTableOptions = {
    isSynced: false,
    tableName: "card_condition",
    primaryKeyType: "text"
  };
  return createTable(db, options)
    .addColumn("sequence", "integer", (col: ColumnDefinitionBuilder) => col.notNull().unique())
    .addColumn("color_code", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("expression", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("condition", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("us_expression", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("description", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .execute();
}

/*
 * values are taken from https://help.cardmarket.com/en/CardCondition
 * in the future we could also offer descriptions in other languages and the images
 */
function populateV1_0_0_CardCondition(db: Kysely<any>) {
  const values = new Array<Insertable<CardConditionTable>>();
  const now = sqliteUTCTimeStamp();

  values.push({
    created_at: now,
    id: "MT",
    color_code: "",
    sequence: 0,
    expression: "Mint",
    condition: "Perfect",
    us_expression: "Mint",
    description: "<p>A mint card is in perfect condition; no excuses. This means, that the front is in perfect condition, there are no scratches on the surface, and the surface is perfectly clean. For the back it means, that the card is indistinguishable from cards of a newly openend booster. If a card has a signature or a Grand Prix stamp it can never be graded Mint, even if the card stock is otherwise in Mint condition.</p>" +
      "<p>In most cases it doesn't make sense to grade a card as Mint. For newer cards, the value of a Mint card is basically the same as a Near Mint card. Older cards (1993-96), however, may command a high premium if they are in actual Mint condition - usually professionally graded. Thus 'Mint' is mainly a grading for cards where there is a high collectors' interest or a high professional grade.For cards that are sold mostly for playing purpose, a Near Mint grade is a safer choice."
  });
  values.push({
    created_at: now,
    id: "NM",
    color_code: "",
    sequence: 1,
    expression: "Near Mint",
    condition: "Pack-Fresh",
    us_expression: "Near Mnt",
    description: "<p>A Near Mint card looks like it has never been played without sleeves. Small allowances can be made, but the card generally shows no wear.</p>" +
      "<p>The border of NM card can have small white spots, but they must be very few and very small. When the card is inspected under bright daylight, the surface must generally appear clean. It can have a few minor spots, but scratches can never be allowed for NM cards." +
      "<p>Generally a Near Mint card is in a condition that would make it considered unmarked if played in an unsleeved deck. (Not recommended!)</p>" +
      "<p>As the Mint grade is often not used for cards of newer expansions, Near Mint usually means Near Mint or better(equivalent to the American NM/ M grade)."
  });
  values.push({
    created_at: now,
    id: "EX",
    color_code: "",
    sequence: 2,
    expression: "Excellent",
    condition: "Minor Wear",
    us_expression: "Slightly Played | Excellent",
    description: "<p>An Excellent card looks like it was used for a few games without sleeves. For Excellent cards it is almost always clearly visible upon first inspection that the card is not in perfect condition. However, although the damage is clearly visible it is only of minor severity.</p>" +
      "<p>Excellent cards usually have a couple of white spots at the corners or around the border.The surface may have minor scratches, that are visible upon closer inspection. However, the card cannot be graded Excellent if the creases are so deep that they are visible upon first sight.</p>" +
      "<p>An Excellent card is usually in a condition where it is not quite clear if the card would be considered marked or unmarked if it would be played in a tournament without sleeves.</p>" +
      "<p>The American equivalent usually is Slightly Played or Lightly Played(not to be confused with the European Light Played)."
  });
  values.push({
    created_at: now,
    id: "GD",
    color_code: "",
    sequence: 3,
    expression: "Good",
    condition: "Visible Wear",
    us_expression: "Moderately Played | Very Good",
    description: "<p>A Good card looks like it might have been used for a long tournament without sleeves.</p>" +
      "<p>Cards in Good condition usually show strong wear all around the card. The edges and corners have many white spots, the surface usually has scratches and the card usually has accumulated some dirt on its surface. However, the card still only has damage that stems from regular play. The card has no water damage or bends whatsoever.</p>" +
      "<p>A Good card(and all cards in worse condition) are clearly in a condition that would make them ineligible for play without sleeves as they would be considered marked.</p>" +
      "<p>The American equivalent to this is usually 'Moderately Played' or 'Very Good'. Note that 'Good' is a bit of a misnomer. A Good card doesn't really look good. In fact it looks pretty beat up, making the American Very Good even more of a misnomer.</p>"
  });
  values.push({
    created_at: now,
    id: "LP",
    color_code: "",
    sequence: 4,
    expression: "Light Played",
    condition: "Severe Wear",
    us_expression: "Played | Good",
    description: "<p>A Light Played card looks as if it has been used without sleeves for an extended period of time.</p>" +
      "<p>A Light Played card is clearly legal for play in a sleeved deck. It has also not been tampered with (inked border, random scribblings on the card etc.). If both of these criteria apply the card may look very bad, but it can be graded Light Played.</p>" +
      "<p>The American equivalent usually is 'Played' or 'Good'."
  });
  values.push({
    created_at: now,
    id: "PL",
    color_code: "",
    sequence: 5,
    expression: "Played",
    condition: "Damaged",
    us_expression: "Heavily Played",
    description: "<p>A Played card looks as bad as you can get a card through regular use without sleeves.</p>" +
      "<p>A Played card looks extremely bad, and it is doubtful if the card is tournament legal even in a sleeved deck. However, the card has not been tampered with otherwise (inked border, random scribblings on the card etc.).</p>" +
      "<p>The American equivalent usually is Heavily Played or Good."
  });
  values.push({
    created_at: now,
    id: "PO",
    color_code: "",
    sequence: 6,
    expression: "Poor",
    condition: "Destroyed",
    us_expression: "Poort",
    description: "<p>A Poor card has damage that cannot normally have stemmed from regular use of the card.</p>" +
      "<p>A card in Poor condition is literally destroyed. It is either obviously illegal for tournament play or has been tampered with in ways that destroy its worth almost completely (inked border, random scribblings on the card etc.).</p>" +
      "<p>Americans usually use Poor in the same way."
  });
  return db
    .insertInto("card_condition")
    .values(values)
    .execute();
}
