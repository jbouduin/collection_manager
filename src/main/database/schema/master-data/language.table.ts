import { ColumnType } from "kysely";
import { MtgLanguage } from "../../../../common/types";
import { NonSynchronizedWithStringId } from "../base.types";


export interface LanguageTable extends NonSynchronizedWithStringId<MtgLanguage> {
  sequence: ColumnType<number, number, never>;
  printed_code: ColumnType<string, string | undefined, never>;
  display_text: ColumnType<string, string, never>;
  button_text: ColumnType<string, string, never>;
}
