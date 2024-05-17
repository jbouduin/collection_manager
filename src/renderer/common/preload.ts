import { contextBridge, ipcRenderer } from "electron";
import { IQueryParam, QueryOptions } from "../../common/ipc-params";
import { DarkmodeOption } from "../../common/ipc-params/darkmode.option";

// define
const versions = {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
};

const ipc = {
  darkmode: (mode: DarkmodeOption) => ipcRenderer.invoke("darkmode", mode),
  query: (param: IQueryParam<QueryOptions>) => ipcRenderer.invoke("query", param),
  sync: (param: IQueryParam<QueryOptions>) => ipcRenderer.invoke("sync", param),
  // FEATURE extended progress reporting with two progress bars
  onProgress: (callback: (status: string) => void) => ipcRenderer.on("splash", (_event, value) => callback(value))
};

// expose
contextBridge.exposeInMainWorld("versions", versions);
contextBridge.exposeInMainWorld("ipc", ipc);

export type Versions = typeof versions;
export type IPC = typeof ipc;
