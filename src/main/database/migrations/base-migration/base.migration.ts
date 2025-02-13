/* eslint-disable  @typescript-eslint/no-explicit-any */
import { Kysely } from "kysely";

export interface IBaseMigration {
  get keyName(): string;
  up(db: Kysely<any>): Promise<void>;
  down(db: Kysely<any>): Promise<void>;
}
