import { PrimaryKeyColumnDefinition } from "./primary-key-column-definition";

export interface CreateTableOptions {
  tableName: string;
  isSynced: boolean;
  defaultIdPrimaryKey?: boolean;
  primaryKey?: Array<PrimaryKeyColumnDefinition>;
}
