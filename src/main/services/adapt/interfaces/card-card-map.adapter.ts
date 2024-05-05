import { DatabaseSchema } from "../../../database/schema";
import { IMapTableAdapter } from "./map-table.adapter";

export type ICardCardMapAdapter = IMapTableAdapter<DatabaseSchema, "card_card_map">;
