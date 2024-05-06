/* eslint-disable  @typescript-eslint/no-explicit-any */
import { ITableAdapter } from "./table.adapter";
import { DatabaseSchema } from "../../../database/schema";

export type IRulingAdapter = ITableAdapter<DatabaseSchema, "ruling">;
