enum EPostType {
  Configuration
}

export type PostType = keyof typeof EPostType;
