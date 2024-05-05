import { DatabaseSchema } from "../../../database/schema";
import { ITableAdapter } from "./table.adapter";

export type ICardSetAdapter = ITableAdapter<DatabaseSchema, "card_set">;
