export interface IConfigurationService {
  getDataBaseName(): string;
  getDataDirectory(): string;
  isNewInstallation(): boolean;
}
