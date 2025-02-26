import { Versions, IPC } from "./common/preload";

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    versions: Versions;
    ipc: IPC;
  }
}

export { };
