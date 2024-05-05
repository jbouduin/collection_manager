import { DatabaseSchema } from "../../../database/schema";
import { ITableAdapter } from "./table.adapter";

export type ICardAdapter = ITableAdapter<DatabaseSchema, "card">;
