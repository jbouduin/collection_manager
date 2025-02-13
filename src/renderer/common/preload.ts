import { contextBridge, ipcRenderer } from "electron";

import { PostData, PostParam, QueryOptions, QueryParam } from "../../common/ipc-params";
import { DarkmodeOption } from "../../common/ipc-params/darkmode.option";
import { SyncParamDto } from "../../common/dto";
import { IpcChannel, IpcRequest, IpcResponse } from "../../common/ipc";

// define
const versions = {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
};

const ipc = {
  // Renderer to Main
  data: (channel: IpcChannel, request: IpcRequest<unknown>) => ipcRenderer.invoke(channel, request) as Promise<IpcResponse<unknown>>,
  darkmode: (mode: DarkmodeOption) => ipcRenderer.invoke("darkmode", mode),
  query: (param: QueryParam<QueryOptions>) => ipcRenderer.invoke("query", param),
  sync: (param: SyncParamDto) => ipcRenderer.invoke("sync", param),
  post: (param: PostParam<PostData>) => ipcRenderer.invoke("post", param),
  // FEATURE extended progress reporting with two progress bars
  onProgress: (callback: (status: string) => void) => {
    // to avoid memory leaks and as only the splash screen is listening to it
    ipcRenderer.removeAllListeners("splash");
    ipcRenderer.on("splash", (_event, value) => callback(value as string));
  },
  onEndProgress: (callback: () => void) => ipcRenderer.once("splash-end", () => {
    ipcRenderer.removeAllListeners("splash");
    callback();
  })
};


// expose
contextBridge.exposeInMainWorld("versions", versions);
contextBridge.exposeInMainWorld("ipc", ipc);

export type Versions = typeof versions;
export type IPC = typeof ipc;
