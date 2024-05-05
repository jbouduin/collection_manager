import { DatabaseSchema } from "../../../database/schema";
import { IBaseAdapter } from "./base.adapter";

export type ICardSetAdapter = IBaseAdapter<DatabaseSchema, "card_set">;
