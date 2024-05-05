import { DatabaseSchema } from "../../../../main/database/schema";
import { IBaseAdapter } from "./base.adapter";

export type ISymbologyAdapter = IBaseAdapter<DatabaseSchema, "symbology">;
