import { contextBridge, ipcRenderer } from 'electron';

const versions = {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
}
contextBridge.exposeInMainWorld('versions', versions)

const ipc = {
  ping: () => ipcRenderer.invoke('ping')
}

export type Versions = typeof versions;
export type IPC = typeof ipc;

// toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
// system: () => ipcRenderer.invoke('dark-mode:system')
// we can also expose variables, not just functions
