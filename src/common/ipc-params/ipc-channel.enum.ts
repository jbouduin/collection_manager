/* eslint-disable @typescript-eslint/no-unused-vars */
enum EIpcChannel {
  darkmode,
  ping,
  query,
  sync
}

export type IpcChannel = keyof typeof EIpcChannel;
