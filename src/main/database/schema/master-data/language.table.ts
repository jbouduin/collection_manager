import { ColumnType, Insertable, Selectable, Updateable } from "kysely";

import { MTGLanguage } from "../../../../common/enums";
import { NonSynchronized } from "../base.types";


export interface LanguageTable extends NonSynchronized {
  id: ColumnType<MTGLanguage, MTGLanguage, never>;
  printed_code: ColumnType<string, string | undefined, never>;
  display_text: ColumnType<string, string, never>;
  button_text: ColumnType<string, string, never>;
}

export type Language = Selectable<LanguageTable>;
export type NewLanguage = Insertable<LanguageTable>;
export type UpdateLanguage = Updateable<LanguageTable>;
