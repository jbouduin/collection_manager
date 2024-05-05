
import { DatabaseSchema } from "../../../database/schema";
import { IChildTableAdapter } from "./child-table.adapter";

export type ICardImageAdapter = IChildTableAdapter<DatabaseSchema, "card_image">;
