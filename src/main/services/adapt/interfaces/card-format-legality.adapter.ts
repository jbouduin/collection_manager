
import { DatabaseSchema } from "../../../database/schema";
import { IChildTableAdapter } from "./child-table.adapter";

export type ICardFormatLegalityAdapter = IChildTableAdapter<DatabaseSchema, "card_format_legality">;
