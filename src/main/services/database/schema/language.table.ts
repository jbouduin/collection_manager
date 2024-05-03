import { ColumnType, Insertable, Selectable, Updateable } from "kysely";
import { NonSyncedTable } from "./non-synced.table";
import { MTGLanguage } from "../../../..//common/enums";

// fields are not updateable in code: if required languages will be updated during migration
export interface LanguageTable extends NonSyncedTable {
  id: ColumnType<MTGLanguage, MTGLanguage, never>;
  printed_code: ColumnType<string, string | undefined, never>;
  display_text: ColumnType<string, string, never>;
  button_text: ColumnType<string, string, never>;
}

export type Language = Selectable<LanguageTable>;
export type NewLanguage = Insertable<LanguageTable>;
export type UpdateLanguage = Updateable<LanguageTable>;
