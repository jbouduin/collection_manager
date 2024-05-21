import { ColumnType } from "kysely";

import { CardFrame, MTGLanguage } from "../../../../common/enums";

export interface CardFaceLocalizationTable {
  id: ColumnType<string, string | undefined, never>;
  cardface_id?: ColumnType<string, string | undefined, never>;
  lang: ColumnType<MTGLanguage, MTGLanguage, never>;
  // frame is here due to Fourth Edition Foreign Black Border
  frame: ColumnType<CardFrame, string>;
  printed_name?: ColumnType<string, string | undefined>;
  printed_text?: ColumnType<string, string | undefined>;
  printed_type_line: ColumnType<string, string | undefined>;
  flavor_name?: ColumnType<string, string | undefined>;
  flavor_text?: ColumnType<string, string | undefined>;
}
