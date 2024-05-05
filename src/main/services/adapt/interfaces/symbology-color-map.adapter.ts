import { DatabaseSchema } from "../../../../main/database/schema";
import { IMapTableAdapter } from "./map-table.adapter";

export type ISymbologyColorMapAdapter = IMapTableAdapter<DatabaseSchema, "symbology_color_map">;
