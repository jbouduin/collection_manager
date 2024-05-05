
import { DatabaseSchema } from "../../../../main/database/schema";
import { IChildTableAdapter } from "./child-table.adapter";

export type ISymbologyAlternativeAdapter = IChildTableAdapter<DatabaseSchema, "symbology_alternative">;
