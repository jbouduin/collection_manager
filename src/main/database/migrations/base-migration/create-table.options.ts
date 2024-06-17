import { PrimaryKeyColumnDefinition } from "./primary-key-column-definition";

export interface CreateTableOptions {
  tableName: string;
  isSynced: boolean;
  primaryKeyType: "text" | "integer" | "custom";
  primaryKey?: Array<PrimaryKeyColumnDefinition>;
}
