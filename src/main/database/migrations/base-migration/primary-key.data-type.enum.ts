enum EPrimaryKeyDataType {
  text,
  integer,
  composed
}

export type PrimaryKeyDataType = keyof typeof EPrimaryKeyDataType;
