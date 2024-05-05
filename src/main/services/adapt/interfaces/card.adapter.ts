import { DatabaseSchema } from "../../../database/schema";
import { IBaseAdapter } from "./base.adapter";

export type ICardAdapter = IBaseAdapter<DatabaseSchema, "card">;
