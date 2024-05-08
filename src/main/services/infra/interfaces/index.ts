export * from "./database.service";
export * from "./ipc-dispatcher.service";
export * from "./ipc-query.service";
export * from "./ipc-query-or-sync.service";
export * from "./ipc-sync.service";

const INFRATOKENS = Object.freeze({
  DatabaseService: "DatabaseService",
  IpcDispatcherService: "IpcDispatcherService",
  IpcQueryOrSyncService: "IpcQueryOrSyncService",
  IpcQueryService: "IpcQueryService",
  IpcSyncService: "IIpcSyncService"
});

export default INFRATOKENS;
