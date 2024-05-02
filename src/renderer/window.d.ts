import { Versions, IPC } from "./preload";

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    versions: Versions;
    ipc: IPC
  }
}

export { };
