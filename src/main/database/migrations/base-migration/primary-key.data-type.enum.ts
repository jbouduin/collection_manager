/* eslint-disable @typescript-eslint/no-unused-vars */
enum EPrimaryKeyDataType {
  text,
  integer,
  composed
}

export type PrimaryKeyDataType = keyof typeof EPrimaryKeyDataType;
