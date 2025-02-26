import { EIpcStatus } from "./ipc-status.enum";

export interface IpcResponse<T> {
  status: EIpcStatus;
  data?: T;
  message?: string;
}
