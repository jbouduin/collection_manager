
import { DatabaseSchema } from "../../../database/schema";
import { IChildTableAdapter } from "./child-table.adapter";

export type ICardMultiverseIdAdapter = IChildTableAdapter<DatabaseSchema, "card_multiverse_id">;
