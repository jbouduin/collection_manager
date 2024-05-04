/* eslint-disable  @typescript-eslint/no-explicit-any */
import { ColumnDefinitionBuilder, Kysely, Transaction } from "kysely";
import { NewLanguage } from "../schema/master-data/language.table";
import { BaseMigration } from "./base.migration";

export class V0_0_1_Language_Migration extends BaseMigration {

  public async up(db: Kysely<any>): Promise<void> {
    await db.transaction().execute(async (trx: Transaction<any>) => {
      super.createTable(trx, "language", false)
        .addColumn("printed_code", "text")
        .addColumn("display_text", "text", (col: ColumnDefinitionBuilder) => col.notNull())
        .addColumn("button_text", "text")
        .execute();

      const values: Array<NewLanguage> = new Array<NewLanguage>();
      values.push({ id: "en", printed_code: "EN", display_text: "English", button_text: "EN" });
      values.push({ id: "es", printed_code: "SP", display_text: "Spanish", button_text: "ES" });
      values.push({ id: "fr", printed_code: "FR", display_text: "French", button_text: "FR" });
      values.push({ id: "de", printed_code: "DE", display_text: "German", button_text: "DE" });
      values.push({ id: "it", printed_code: "IT", display_text: "Italian", button_text: "IT" });
      values.push({ id: "pt", printed_code: "PT", display_text: "Portuguese", button_text: "PT" });
      values.push({ id: "ja", printed_code: "JP", display_text: "Japanese", button_text: "JA" });
      values.push({ id: "ko", printed_code: "KR", display_text: "Korean", button_text: "KO" });
      values.push({ id: "ru", printed_code: "RU", display_text: "Russian", button_text: "RU" });
      values.push({ id: "zhs", printed_code: "CS", display_text: "Simplified Chinese", button_text: "汉语" });
      values.push({ id: "zht", printed_code: "CT", display_text: "Traditinal Chinese", button_text: "漢語" });
      values.push({ id: "he", display_text: "Hebrew" });
      values.push({ id: "la", display_text: "Latin" });
      values.push({ id: "grc", display_text: "Ancient Greek", });
      values.push({ id: "ar", display_text: "Arabic", });
      values.push({ id: "sa", display_text: "Sanskrit", });
      values.push({ id: "ph", printed_code: "PH", display_text: "Phyrexian" });

      await trx.insertInto("language")
        .values(values)
        .executeTakeFirstOrThrow();
    }
    );
  }

  public async down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("language").execute();
  }
}
