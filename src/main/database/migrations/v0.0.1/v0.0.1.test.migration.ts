/* eslint-disable  @typescript-eslint/no-explicit-any */
import { ColumnDefinitionBuilder, InsertResult, Kysely } from "kysely";
import { CreateTableOptions, IBaseMigration } from "../base-migration";
import { createTable } from "../base-migration/create-table.func";

export class V0_0_1_Test_Migration implements IBaseMigration {
  public get keyName(): string {
    return "1003: v.0.0.1.Test";
  }

  public async up(db: Kysely<any>): Promise<void> {
    return createV0_0_1_Test(db)
      .then(() => populateV0_0_1_Test(db))
      .then(() => Promise.resolve());
  }

  public async down(db: Kysely<any>): Promise<void> {
    return db.schema.dropTable("test").execute();
  }
}

function createV0_0_1_Test(db: Kysely<any>): Promise < void> {
  const options: CreateTableOptions = {
    isSynced: false,
    tableName: "test",
    primaryKeyType: "text"
  };

  return createTable(db, options)
    .addColumn("sequence", "integer", (col: ColumnDefinitionBuilder) => col.notNull())
    .addColumn("printed_code", "text")
    .addColumn("display_text", "text", (col: ColumnDefinitionBuilder) => col.notNull())
    .addColumn("button_text", "text")
    .execute();
}

async function populateV0_0_1_Test(db: Kysely<any>): Promise<Array<InsertResult>> {
  const values = new Array<any>();
  values.push({ id: "en", sequence: 0, printed_code: "EN", display_text: "English", button_text: "EN" });
  values.push({ id: "es", sequence: 1, printed_code: "SP", display_text: "Spanish", button_text: "ES" });
  values.push({ id: "fr", sequence: 2, printed_code: "FR", display_text: "French", button_text: "FR" });
  values.push({ id: "de", sequence: 3, printed_code: "DE", display_text: "German", button_text: "DE" });
  values.push({ id: "it", sequence: 4, printed_code: "IT", display_text: "Italian", button_text: "IT" });
  values.push({ id: "pt", sequence: 5, printed_code: "PT", display_text: "Portuguese", button_text: "PT" });
  values.push({ id: "ja", sequence: 6, printed_code: "JP", display_text: "Japanese", button_text: "日本語" });
  values.push({ id: "ko", sequence: 7, printed_code: "KR", display_text: "Korean", button_text: "KO" });
  values.push({ id: "ru", sequence: 8, printed_code: "RU", display_text: "Russian", button_text: "RU" });
  values.push({ id: "zhs", sequence: 9, printed_code: "CS", display_text: "Simplified Chinese", button_text: "汉语" });
  values.push({ id: "zht", sequence: 10, printed_code: "CT", display_text: "Traditinal Chinese", button_text: "漢語" });
  values.push({ id: "he", sequence: 11, display_text: "Hebrew" });
  values.push({ id: "la", sequence: 12, display_text: "Latin" });
  values.push({ id: "grc", sequence: 13, display_text: "Ancient Greek", });
  values.push({ id: "ar", sequence: 14, display_text: "Arabic", });
  values.push({ id: "sa", sequence: 15, display_text: "Sanskrit", });
  values.push({ id: "ph", sequence: 16, printed_code: "PH", display_text: "Phyrexian" });

  return db.insertInto("test")
    .values(values)
    .execute();
}
