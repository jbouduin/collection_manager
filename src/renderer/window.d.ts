import { Versions, IPC } from "./shared/preload";

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    versions: Versions;
    ipc: IPC;
  }
}

export { };
