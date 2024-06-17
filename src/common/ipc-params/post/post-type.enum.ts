enum EPostType {
  Collection,
  Configuration
}

export type PostType = keyof typeof EPostType;
