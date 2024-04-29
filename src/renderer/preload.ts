import { contextBridge, ipcRenderer } from 'electron';

// define
const versions = {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
}

const ipc = {
  ping: () => ipcRenderer.invoke('ping'),
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system')
}

// expose
contextBridge.exposeInMainWorld('versions', versions)
contextBridge.exposeInMainWorld('ipc', ipc)

export type Versions = typeof versions;
export type IPC = typeof ipc;
