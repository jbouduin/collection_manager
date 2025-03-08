import { ColumnDefinitionBuilder, InsertResult, Insertable, Kysely } from "kysely";
import { sqliteUTCTimeStamp } from "../../../../../common/util";
import { LanguageTable } from "../../../schema";
import { CreateTableOptions, IBaseMigration, createTable } from "../../base-migration";


/* eslint-disable  @typescript-eslint/no-explicit-any */
export class V1_0_0_Language_Migration implements IBaseMigration {
  public get keyName(): string {
    return "0003: v.1.0.0.Language";
  }

  public async up(db: Kysely<any>): Promise<void> {
    return createV1_0_0_Language(db)
      .then(() => populateV1_0_0_Language(db))
      .then(() => Promise.resolve());
  }

  public async down(db: Kysely<any>): Promise<void> {
    return db.schema.dropTable("language").execute();
  }
}

async function createV1_0_0_Language(db: Kysely<any>): Promise<void> {
  const options: CreateTableOptions = {
    isSynced: false,
    tableName: "language",
    primaryKeyType: "text"
  };

  return createTable(db, options)
    .addColumn("sequence", "integer", (col: ColumnDefinitionBuilder) => col.notNull())
    .addColumn("printed_code", "text")
    .addColumn("display_text", "text", (col: ColumnDefinitionBuilder) => col.notNull())
    .addColumn("button_text", "text")
    .execute();
}

async function populateV1_0_0_Language(db: Kysely<any>): Promise<Array<InsertResult>> {
  const values = new Array<Insertable<LanguageTable>>();
  const now = sqliteUTCTimeStamp();
  values.push({ created_at: now, id: "en", sequence: 0, printed_code: "EN", display_text: "English", button_text: "EN" });
  values.push({ created_at: now, id: "es", sequence: 1, printed_code: "SP", display_text: "Spanish", button_text: "ES" });
  values.push({ created_at: now, id: "fr", sequence: 2, printed_code: "FR", display_text: "French", button_text: "FR" });
  values.push({ created_at: now, id: "de", sequence: 3, printed_code: "DE", display_text: "German", button_text: "DE" });
  values.push({ created_at: now, id: "it", sequence: 4, printed_code: "IT", display_text: "Italian", button_text: "IT" });
  values.push({ created_at: now, id: "pt", sequence: 5, printed_code: "PT", display_text: "Portuguese", button_text: "PT" });
  values.push({ created_at: now, id: "ja", sequence: 6, printed_code: "JP", display_text: "Japanese", button_text: "日本語" });
  values.push({ created_at: now, id: "ko", sequence: 7, printed_code: "KR", display_text: "Korean", button_text: "KO" });
  values.push({ created_at: now, id: "ru", sequence: 8, printed_code: "RU", display_text: "Russian", button_text: "RU" });
  values.push({ created_at: now, id: "zhs", sequence: 9, printed_code: "CS", display_text: "Simplified Chinese", button_text: "汉语" });
  values.push({ created_at: now, id: "zht", sequence: 10, printed_code: "CT", display_text: "Traditinal Chinese", button_text: "漢語" });
  values.push({ created_at: now, id: "he", sequence: 11, display_text: "Hebrew" });
  values.push({ created_at: now, id: "la", sequence: 12, display_text: "Latin" });
  values.push({ created_at: now, id: "grc", sequence: 13, display_text: "Ancient Greek" });
  values.push({ created_at: now, id: "ar", sequence: 14, display_text: "Arabic" });
  values.push({ created_at: now, id: "sa", sequence: 15, display_text: "Sanskrit" });
  values.push({ created_at: now, id: "ph", sequence: 16, printed_code: "PH", display_text: "Phyrexian" });

  return db.insertInto("language")
    .values(values)
    .execute();
}
