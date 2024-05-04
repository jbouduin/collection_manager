/* eslint-disable  @typescript-eslint/no-explicit-any */
import { ColumnDefinitionBuilder, Kysely, Transaction } from "kysely";
import { NewColor } from "../../schema/master-data/color.table";
import { BaseMigration } from "../base.migration";

// TODO once scryfall-sdk removed rename symbology to CardSymbol
export class V0_0_1_Symbology_Migration extends BaseMigration {
  public get keyName(): string {
    return "0005: v.0.0.1.Symbology";
  }

  public async up(db: Kysely<any>): Promise<void> {
    await db.transaction().execute(async (trx: Transaction<any>) => {
      await super
        .createTable(trx, "symbology", true)
        .addColumn("svg_uri", "text", (col: ColumnDefinitionBuilder) => col.notNull())
        .addColumn("loose_variant", "text")
        .addColumn("english", "text", (col: ColumnDefinitionBuilder) => col.notNull())
        .addColumn("transposable", "integer", (col: ColumnDefinitionBuilder) => col.notNull())
        .addColumn("represents_mana", "integer", (col: ColumnDefinitionBuilder) => col.notNull())
        .addColumn("appears_in_mana_costs", "integer", (col: ColumnDefinitionBuilder) => col.notNull())
        .addColumn("mana_value", "decimal")
        .addColumn("hybrid", "integer", (col: ColumnDefinitionBuilder) => col.notNull())
        .addColumn("phyrexian", "integer", (col: ColumnDefinitionBuilder) => col.notNull())
        .addColumn("cmc", "decimal")
        .addColumn("funny", "integer", (col: ColumnDefinitionBuilder) => col.notNull())
        .execute();

      await super
        .createTable(
          trx,
          "symbology_color_map",
          true,
          [
            { columnName: "symbology_id", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.references("symbology.id").onDelete("cascade").notNull() },
            { columnName: "color_id", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.references("color.id").onDelete("cascade").notNull() }
          ]
        )
        .execute();

      await super
        .createTable(
          trx,
          "symbology_alternative",
          true,
          [
            { columnName: "symbology_id", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.references("symbology.id").onDelete("cascade").notNull() },
            { columnName: "alternative", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.notNull() }
          ]
        )
        .execute();
    });
  }

  public async down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("Symbology").execute();
  }
}
