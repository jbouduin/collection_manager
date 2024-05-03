enum EIpcChannel {
  darkmode,
  ping,
  query,
  sync
}

export type IpcChannel = keyof typeof EIpcChannel;
