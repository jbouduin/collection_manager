export * from "./database.service";
export * from "./ipc-dispatcher.service";
export * from "./ipc-query.service";
export * from "./ipc-sync.service";

const INFRATOKENS = Object.freeze({
  // TODO this one should get out
  CustomMigrationProvider: Symbol("CustomMigrationProvider"),
  DatabaseService: Symbol("DatabaseService"),

  IpcDispatcherService: Symbol("IpcDispatcherService"),
  IpcQueryService: Symbol("IpcQueryService"),
  IpcSyncService: Symbol("IIpcSyncService")
});

export default INFRATOKENS;
