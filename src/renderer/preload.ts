import { contextBridge, ipcRenderer } from "electron";
import { QueryType } from "../common/enums";
import { ISyncParam, SyncOptions } from "../common/ipc-params";
import { DarkmodeOption } from "../common/ipc-params/darkmode.option";

// define
const versions = {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
};

const ipc = {
  ping: () => ipcRenderer.invoke("ping"),
  darkmode: (mode: DarkmodeOption) => ipcRenderer.invoke("darkmode", mode),
  query: (queryType: QueryType) => ipcRenderer.invoke("query", queryType),
  sync: (param: ISyncParam<SyncOptions> ) => ipcRenderer.invoke("sync", param)
};

// expose
contextBridge.exposeInMainWorld("versions", versions);
contextBridge.exposeInMainWorld("ipc", ipc);

export type Versions = typeof versions;
export type IPC = typeof ipc;
