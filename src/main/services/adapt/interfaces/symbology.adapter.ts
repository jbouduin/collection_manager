import { DatabaseSchema } from "../../../../main/database/schema";
import { ITableAdapter } from "./table.adapter";

export type ISymbologyAdapter = ITableAdapter<DatabaseSchema, "symbology">;
