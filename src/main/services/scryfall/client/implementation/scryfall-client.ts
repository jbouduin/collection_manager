import { inject, injectable } from "tsyringe";

import { CatalogType } from "../../../../../common/enums";
import { CardSyncOptions, ProgressCallback } from "../../../../../common/ipc-params";
import INFRATOKENS, { IConfigurationService } from "../../../../../main/services/infra/interfaces";
import { ScryfallCard, ScryfallCardSet, ScryfallCatalog, ScryfallEndpoint, ScryfallRuling } from "../../types";
import { ScryfallList } from "../../types/scryfall-list";
import { IScryfallClient, ScryfallSearchOptions } from "../interfaces";
import { ScryfallCardSymbol } from "../../types/card-symbol/scryfall-card-symbol";


@injectable()
export class ScryfallClient implements IScryfallClient {

  //#region private readonly fields -------------------------------------------
  private readonly scryfallApiRoot: string;
  private readonly scryfallCatalogPaths: Map<CatalogType, string>;
  private readonly scryfallEndpoints: Map<ScryfallEndpoint, string>;
  //#endregion

  //#region private fields ----------------------------------------------------
  private minimumRequestTimeout: number;
  private nextQuery: number;
  //#endregion

  //#region Construcotr & C^ --------------------------------------------------
  public constructor(
    @inject(INFRATOKENS.ConfigurationService) configurationService: IConfigurationService) {
    this.scryfallApiRoot = configurationService.scryfallApiRoot;
    this.scryfallCatalogPaths = configurationService.scryfallCatalogPaths;
    this.scryfallEndpoints = configurationService.scryfallEndpoints;
    // the api requests 50-100 ms between calls, let's give it some slack
    this.minimumRequestTimeout = 60;
    this.nextQuery = Date.now() + this.minimumRequestTimeout;
  }
  //#endregion

  //#region IScryfallClient methods -------------------------------------------
  public async fetchSvg(uri: string): Promise<ArrayBuffer> {
    return this.tryFetch(uri)
      .then((response: Response) => response.arrayBuffer());
  }

  public async fetchImage(uri: string): Promise<ReadableStream<Uint8Array>> {
    return this.tryFetch(uri)
      .then((response: Response) => response.body);
  }

  public async getCatalog(type: CatalogType): Promise<ScryfallCatalog> {
    const uri = `${this.scryfallApiRoot}/${this.scryfallEndpoints.get("catalog")}/${this.scryfallCatalogPaths.get(type)}`;
    return this
      .tryFetch(uri)
      .then((fetchResult: Response) => fetchResult.json());
  }

  // FEATURE use emitter in getCards or in getlist
  public async getCards(options: CardSyncOptions): Promise<Array<ScryfallCard>> {
    const scryfallOptions: ScryfallSearchOptions = {
      unique: "prints",
      include_extras: true,
      include_multilingual: true,
      include_variations: true
    };
    const uri = this.buildCardUri(options, scryfallOptions);
    return this.fetchList<ScryfallCard>(uri, new Array<ScryfallCard>());
  }

  public async getCardSets(): Promise<Array<ScryfallCardSet>> {
    const uri = `${this.scryfallApiRoot}/${this.scryfallEndpoints.get("cardSet")}`;
    return this.fetchList<ScryfallCardSet>(uri, new Array<ScryfallCardSet>());
  }

  public getCardSymbols(): Promise<Array<ScryfallCardSymbol>> {
    const uri = `${this.scryfallApiRoot}/${this.scryfallEndpoints.get("cardSymbol")}`;
    return this.fetchList<ScryfallCardSymbol>(uri, new Array<ScryfallCardSymbol>());
  }



  public async getRulings(cardId: string): Promise<Array<ScryfallRuling>> {
    const uri = `${this.scryfallApiRoot}/${this.scryfallEndpoints.get("ruling").replace(":id", cardId)}`;
    return this.fetchList<ScryfallRuling>(uri, new Array<ScryfallRuling>());
  }


  //#endregion

  //#region private methods ---------------------------------------------------
  private async tryFetch(uri: string | URL): Promise<Response> {
    const now = Date.now();
    const sleepTime = this.nextQuery - now;
    this.nextQuery = now + this.minimumRequestTimeout;
    return await this
      .sleep(sleepTime)
      .then(() => fetch(uri))
      .then((result: Response) => {
        console.log(`retrieved ${uri} -> status: ${result.status}`);
        return result;
      });
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => {
      console.log(`sleeping ${ms}`);
      setTimeout(resolve, ms);
    });
  }

  private async fetchList<T extends object>(uri: string | URL, previousPages: Array<T>, progressCallback?: ProgressCallback): Promise<Array<T>> {
    return this.tryFetch(uri)
      .then(async (response: Response) => {
        const fetchedList = ((await response.json()) as ScryfallList<T>);
        previousPages.push(...fetchedList.data);
        if (fetchedList.has_more && fetchedList.next_page) {
          return this.fetchList(fetchedList.next_page, previousPages, progressCallback);
        } else {
          return previousPages;
        }
      });
  }

  private buildCardUri(options: CardSyncOptions, scryfallOptions: ScryfallSearchOptions): URL {
    const x = new URL(`${this.scryfallApiRoot}/${this.scryfallEndpoints.get("card")}`);
    x.searchParams.set("include_extras", scryfallOptions.include_extras ? "true" : "false");
    x.searchParams.set("unique",scryfallOptions.unique);
    x.searchParams.set("include_multilingual", scryfallOptions.include_multilingual ? "true" : "false");
    x.searchParams.set("include_variations", scryfallOptions.include_variations ? "true" : "false");
    const query = new Array<string>();
    query.push(`e=${options.setCode}`);
    query.push("lang=any");
    x.searchParams.set("q", query.join("+"));
    return x;
  }
  //#endregion
}
