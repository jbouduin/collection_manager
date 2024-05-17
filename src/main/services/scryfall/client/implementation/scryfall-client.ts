import { IScryfallClient } from "../interfaces";

export class ScryfallClient implements IScryfallClient {
  private minimumRequestTimeout: number;
  private nextQuery: number;

  public constructor() {
    console.log("api client constructor");
    // the api requests 50-100 ms between calls, let's give it some slack
    this.minimumRequestTimeout = 60;
    this.nextQuery = Date.now() + this.minimumRequestTimeout;
  }

  public async fetchSvg(uri: string): Promise<ArrayBuffer> {
    return this.tryFetch(uri)
      .then((response: Response) => response.arrayBuffer());
  }

  public async fetchImage(uri: string): Promise<ReadableStream<Uint8Array>> {
    return this.tryFetch(uri)
      .then((response: Response) => response.body);
  }

  private async tryFetch(uri: string): Promise<Response> {
    const now = Date.now();
    const sleepTime = this.nextQuery - now;
    this.nextQuery = now + this.minimumRequestTimeout;
    const result = await this.sleep(sleepTime).then(() => fetch(uri));
    return result;
  }

  private async sleep(ms: number): Promise<void>
  {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
