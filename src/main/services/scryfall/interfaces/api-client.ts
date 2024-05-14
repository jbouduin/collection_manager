export interface IApiClient {
  fetchSvg(uri: string): Promise<ArrayBuffer>;
}
