import { contextBridge, ipcRenderer } from 'electron';
import { EIpcChannel, EQueryType, EUpdateType } from '../common';

// define
const versions = {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
}

const ipc = {
  ping: () => ipcRenderer.invoke(EIpcChannel.ping),
  toggle: () => ipcRenderer.invoke(EIpcChannel.darkModeToggle),
  system: () => ipcRenderer.invoke(EIpcChannel.darkModeSystem),
  query: (queryType: EQueryType) => ipcRenderer.invoke(EIpcChannel.query, queryType),
  update: (updateType: EUpdateType) => ipcRenderer.invoke(EIpcChannel.update, updateType)
}

// expose
contextBridge.exposeInMainWorld('versions', versions)
contextBridge.exposeInMainWorld('ipc', ipc)

export type Versions = typeof versions;
export type IPC = typeof ipc;
