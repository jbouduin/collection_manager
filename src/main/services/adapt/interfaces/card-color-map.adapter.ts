import { DatabaseSchema } from "../../../database/schema";
import { IMapTableAdapter } from "./map-table.adapter";

export type ICardColorMapAdapter = IMapTableAdapter<DatabaseSchema, "card_color_map">;
