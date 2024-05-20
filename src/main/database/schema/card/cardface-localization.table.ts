import { ColumnType } from "kysely";
import { Synchronized, SynchronizedWithStringId } from "../base.types";
import { CardFrame, MTGLanguage } from "../../../../common/enums";

export interface CardFaceLocalizationTable extends SynchronizedWithStringId {
  cardface_id?: ColumnType<string, string | undefined>;
  lang: ColumnType<MTGLanguage, MTGLanguage, never>;
  // frame is here due to Fourth Edition Foreign Black Border
  frame: ColumnType<CardFrame, string>;
  printed_name?: ColumnType<string, string | undefined>;
  printed_text?: ColumnType<string, string | undefined>;
  printed_type_line: ColumnType<string, string | undefined>;
  flavor_name?: ColumnType<string, string | undefined>;
  flavor_text?: ColumnType<string, string | undefined>;
}
