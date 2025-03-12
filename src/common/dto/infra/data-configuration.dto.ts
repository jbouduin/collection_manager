export interface IDataConfigurationDto {
  rootDataDirectory: string;
  cacheDirectory: string;
  databaseName: string;
  // FEATURE backup configuration (target directory, backups to keep, interval)
}
