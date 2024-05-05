
import { DatabaseSchema } from "../../../database/schema";
import { IChildTableAdapter } from "./child-table.adapter";

export type ICardGameAdapter = IChildTableAdapter<DatabaseSchema, "card_game">;
