import { contextBridge, ipcRenderer } from "electron";
import { IQueryOrSyncParam, QueryOrSyncOptions } from "../common/ipc-params";
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
  query: (param: IQueryOrSyncParam<QueryOrSyncOptions>) => ipcRenderer.invoke("query", param),
  queryOrSync: (param:  IQueryOrSyncParam<QueryOrSyncOptions>) => ipcRenderer.invoke("queryOrSync", param),
  sync: (param: IQueryOrSyncParam<QueryOrSyncOptions> ) => ipcRenderer.invoke("sync", param)
};

// expose
contextBridge.exposeInMainWorld("versions", versions);
contextBridge.exposeInMainWorld("ipc", ipc);

export type Versions = typeof versions;
export type IPC = typeof ipc;
