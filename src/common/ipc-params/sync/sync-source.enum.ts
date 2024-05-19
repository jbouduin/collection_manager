enum ESyncSource {
  user,
  startup
}

export type SyncSource = keyof typeof ESyncSource;
