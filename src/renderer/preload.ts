import { contextBridge, ipcRenderer } from 'electron';
import { EIpcChannel, EQueryType } from '../common/enums';
import { IBaseSyncParam } from '../common/ipc-params';

// define
const versions = {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
};

const ipc = {
  ping: () => ipcRenderer.invoke(EIpcChannel.ping),
  toggle: () => ipcRenderer.invoke(EIpcChannel.darkModeToggle),
  system: () => ipcRenderer.invoke(EIpcChannel.darkModeSystem),
  query: (queryType: EQueryType) => ipcRenderer.invoke(EIpcChannel.query, queryType),
  sync: (param: IBaseSyncParam ) => ipcRenderer.invoke(EIpcChannel.sync, param)
};

// expose
contextBridge.exposeInMainWorld('versions', versions)
contextBridge.exposeInMainWorld('ipc', ipc)

export type Versions = typeof versions;
export type IPC = typeof ipc;
