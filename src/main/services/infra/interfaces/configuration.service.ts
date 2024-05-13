export interface IConfigurationService {
  readonly isNewInstallation: boolean;
  readonly cacheDirectory: string;
  readonly dataBaseName: string;
  readonly dataDirectory: string;
}
