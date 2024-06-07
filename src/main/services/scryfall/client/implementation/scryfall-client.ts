import { inject, injectable } from "tsyringe";

import { DtoScryfallConfiguration } from "../../../../../common/dto/configuration/scryfall-configuration.dto";
import { CatalogType } from "../../../../../common/enums";
import { CardSyncOptions, ProgressCallback } from "../../../../../common/ipc-params";
import INFRATOKENS, { IConfigurationService } from "../../../../../main/services/infra/interfaces";
import { ScryfallCard, ScryfallCardSet, ScryfallCatalog, ScryfallRuling } from "../../types";
import { ScryfallCardSymbol } from "../../types/card-symbol/scryfall-card-symbol";
import { ScryfallList } from "../../types/scryfall-list";
import { IScryfallClient, ScryfallSearchOptions } from "../interfaces";


@injectable()
export class ScryfallClient implements IScryfallClient {

  //#region private readonly fields -------------------------------------------
  private readonly scryfallConfiguration: DtoScryfallConfiguration;
  //#endregion

  //#region private fields ----------------------------------------------------
  private nextQuery: number;
  //#endregion

  //#region Construcotr & C^ --------------------------------------------------
  public constructor(
    @inject(INFRATOKENS.ConfigurationService) configurationService: IConfigurationService) {
    this.scryfallConfiguration = configurationService.configuration.scryfallConfiguration;
    this.nextQuery = Date.now() + this.scryfallConfiguration.minimumRequestTimeout;
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
    const uri = `${this.scryfallConfiguration.scryfallApiRoot}/${this.scryfallConfiguration.scryfallEndpoints["catalog"]}/${this.scryfallConfiguration.scryfallCatalogPaths[type]}`;
    return this
      .tryFetch(uri)
      .then((fetchResult: Response) => fetchResult.json());
  }

  // LATER use emitter in getCards or in getlist
  public async getCards(options: CardSyncOptions): Promise<Array<ScryfallCard>> {
    if (options.setCode) {
      const scryfallOptions: ScryfallSearchOptions = {
        unique: "prints",
        include_extras: true,
        include_multilingual: true,
        include_variations: true
      };
      const uri = this.buildCardUri(options, scryfallOptions);
      return this.fetchList<ScryfallCard>(uri, new Array<ScryfallCard>());
    } else if (options.cardIds) {
      const requestBody: Array<{ id: string }> = options.cardIds.map((id: string) => { return { id: id }; });
      return await this.tryPost(
        `${this.scryfallConfiguration.scryfallApiRoot}/${this.scryfallConfiguration.scryfallEndpoints["collection"]}`,
        JSON.stringify({ identifiers: requestBody })
      );
    } else {
      return Promise.resolve(new Array<ScryfallCard>());
    }
  }

  public async getCardSets(): Promise<Array<ScryfallCardSet>> {
    const uri = `${this.scryfallConfiguration.scryfallApiRoot}/${this.scryfallConfiguration.scryfallEndpoints["cardSet"]}`;
    return this.fetchList<ScryfallCardSet>(uri, new Array<ScryfallCardSet>());
  }

  public getCardSymbols(): Promise<Array<ScryfallCardSymbol>> {
    const uri = `${this.scryfallConfiguration.scryfallApiRoot}/${this.scryfallConfiguration.scryfallEndpoints["cardSymbol"]}`;
    return this.fetchList<ScryfallCardSymbol>(uri, new Array<ScryfallCardSymbol>());
  }

  public async getRulings(cardId: string): Promise<Array<ScryfallRuling>> {
    const uri = `${this.scryfallConfiguration.scryfallApiRoot}/${this.scryfallConfiguration.scryfallEndpoints["ruling"].replace(":id", cardId)}`;
    return this.fetchList<ScryfallRuling>(uri, new Array<ScryfallRuling>());
  }
  //#endregion

  //#region private methods ---------------------------------------------------
  private async tryFetch(uri: string | URL): Promise<Response> {
    const now = Date.now();
    const sleepTime = this.nextQuery - now;
    this.nextQuery = now + this.scryfallConfiguration.minimumRequestTimeout;
    return await this
      .sleep(sleepTime)
      .then(() => fetch(uri))
      .then((result: Response) => {
        console.log(`retrieved ${uri} -> status: ${result.status}`);
        return result;
      });
  }

  private async tryPost(uri: string | URL, body: string): Promise<Array<ScryfallCard>> {
    const now = Date.now();
    const sleepTime = this.nextQuery - now;
    this.nextQuery = now + this.scryfallConfiguration.minimumRequestTimeout;
    return await this
      .sleep(sleepTime)
      .then(() => fetch(uri, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: body
      }))
      .then(async (response: Response) => {
        console.log(`retrieved ${uri} -> status: ${response.status}`);
        return ((await response.json()) as ScryfallList<ScryfallCard>).data;
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
    const result = new URL(`${this.scryfallConfiguration.scryfallApiRoot}/${this.scryfallConfiguration.scryfallEndpoints["card"]}`);
    result.searchParams.set("include_extras", scryfallOptions.include_extras ? "true" : "false");
    result.searchParams.set("unique", scryfallOptions.unique);
    result.searchParams.set("include_multilingual", scryfallOptions.include_multilingual ? "true" : "false");
    result.searchParams.set("include_variations", scryfallOptions.include_variations ? "true" : "false");
    const query = new Array<string>();
    query.push(`e=${options.setCode}`);
    query.push("lang=any");
    result.searchParams.set("q", query.join("+"));
    return result;
  }
  //#endregion

}
