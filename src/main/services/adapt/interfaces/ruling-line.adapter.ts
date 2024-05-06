/* eslint-disable  @typescript-eslint/no-explicit-any */
import { DatabaseSchema } from "../../../database/schema";
import { IChildTableAdapter } from "./child-table.adapter";

export type IRulingLineAdapter = IChildTableAdapter<DatabaseSchema, "ruling_line">;
