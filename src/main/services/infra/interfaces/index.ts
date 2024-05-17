export * from "./configuration.service";
export * from "./database.service";
export * from "./image-cache.service";
export * from "./ipc-dispatcher.service";
export * from "./ipc-query.service";
export * from "./ipc-sync.service";
export * from "./window.service";

const INFRATOKENS = Object.freeze({
  ConfigurationService: "ConfigurationService",
  DatabaseService: "DatabaseService",
  ImageCacheService: "ImageCacheService",
  IpcDispatcherService: "IpcDispatcherService",
  IpcQueryService: "IpcQueryService",
  IpcSyncService: "IIpcSyncService",
  WindowService: "WindowService"
});

export default INFRATOKENS;
