/* eslint-disable @typescript-eslint/no-unused-vars */
enum EPostType {
  Collection,
  Configuration
}

export type PostType = keyof typeof EPostType;
