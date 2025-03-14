import { createWriteStream } from "fs";
import { Readable } from "stream";
import { finished } from "stream/promises";
import { ReadableStream } from "stream/web";
import { inject, injectable } from "tsyringe";
import { IMtgCardImageDataDto, IScryfallBulkDataItemDto } from "../../../../../common/dto";
import { IScryfallConfigurationDto } from "../../../../../common/dto/infra/scryfall-configuration.dto";
import { ProgressCallback } from "../../../../../common/ipc";
import { CatalogType } from "../../../../../common/types";
import { IConfigurationService, ILogService } from "../../../../../main/services/infra/interfaces";
import { runSerial } from "../../../../../main/services/infra/util";
import { INFRASTRUCTURE } from "../../../service.tokens";
import { IScryfallCardDto, IScryfallCardSetDto, IScryfallCatalogDto, IScryfallRulingDto } from "../../dto";
import { IScryfallCardSymbolDto } from "../../dto/card-symbol/scryfall-card-symbol.dto";
import { IScryfallListDto } from "../../dto/scryfall-list.dto";
import { IScryfallClient, IScryfallSearchOptionsDto } from "../interfaces";

@injectable()
export class ScryfallClient implements IScryfallClient {
  //#region private readonly fields -------------------------------------------
  private readonly scryfallConfiguration: IScryfallConfigurationDto;
  private readonly logService: ILogService;
  //#endregion

  //#region private fields ----------------------------------------------------
  private nextQuery: number;
  //#endregion

  //#region Construcotr & C^ --------------------------------------------------
  public constructor(
    @inject(INFRASTRUCTURE.ConfigurationService) configurationService: IConfigurationService,
    @inject(INFRASTRUCTURE.LogService) logService: ILogService
  ) {
    this.scryfallConfiguration = configurationService.configuration.scryfallConfiguration;
    this.logService = logService;
    this.nextQuery = Date.now() + this.scryfallConfiguration.minimumRequestTimeout;
  }
  //#endregion

  //#region IScryfallClient methods -------------------------------------------
  public async downloadBulkData(uri: string, targetFile: string): Promise<void> {
    const file = createWriteStream(targetFile);
    const init: RequestInit = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        content_encoding: "gzip"
      }
    };
    return await fetch(uri, init)
      .then((response: Response) => {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        return finished(Readable.fromWeb(response.body as ReadableStream<any>).pipe(file));
      });
  }

  public async fetchArrayBuffer(uri: string | URL): Promise<ArrayBuffer> {
    return this.tryFetch(uri)
      .then((response: Response) => response.arrayBuffer());
  }

  public async getAllCards(): Promise<Array<IScryfallCardDto>> {
    return Promise.resolve(new Array<IScryfallCardDto>());
  }

  public getBulkDefinitions(): Promise<Array<IScryfallBulkDataItemDto>> {
    const uri = `${this.scryfallConfiguration.scryfallApiRoot}/${this.scryfallConfiguration.scryfallEndpoints["bulk"]}`;
    return this.fetchList<IScryfallBulkDataItemDto>(uri, new Array<IScryfallBulkDataItemDto>());
  }

  public getCardImage(card: IMtgCardImageDataDto): Promise<ArrayBuffer> {
    let url: URL;
    if (card.side == "back" && card.cardBackId) {
      url = new URL(`${this.scryfallConfiguration.cardBackRoot}/${card.imageType}/${card.cardBackId.substring(0, 1)}/${card.cardBackId.substring(1, 2)}/${card.cardBackId}.jpg`);
    } else {
      url = new URL(`${this.scryfallConfiguration.scryfallApiRoot}/${this.scryfallConfiguration.scryfallEndpoints["cards"].replace(":id", card.cardId)}`);
      url.searchParams.set("format", "image");
      url.searchParams.set("size", card.imageType);
      if (card.side == "back") {
        url.searchParams.set("face", "back");
      }
    }
    return this.fetchArrayBuffer(url);
  }

  public async getCatalog(type: CatalogType, progressCallback: ProgressCallback): Promise<IScryfallCatalogDto> {
    progressCallback(`Fetching catalog '${type}' from Scryfall`);
    const uri = `${this.scryfallConfiguration.scryfallApiRoot}/${this.scryfallConfiguration.scryfallEndpoints.catalog}/${type}`;
    return this
      .tryFetch(uri)
      .then((fetchResult: Response) => fetchResult.json() as Promise<IScryfallCatalogDto>);
  }

  // LATER use emitter in getCards or in getlist
  public async getCardsForCardSet(cardSetCode: string, progressCallback: ProgressCallback): Promise<Array<IScryfallCardDto>> {
    progressCallback("Fetching cards of from Scryfall");
    const scryfallOptions: IScryfallSearchOptionsDto = {
      unique: "prints",
      include_extras: true,
      include_multilingual: true,
      include_variations: true
    };
    const uri = this.buildCardBySetUri(cardSetCode, scryfallOptions);
    return this.fetchList<IScryfallCardDto>(uri, new Array<IScryfallCardDto>());
  }

  public async getCardCollections(cardIds: Array<string>, progressCallback: ProgressCallback): Promise<Array<IScryfallCardDto>> {
    progressCallback(`Fetching ${cardIds.length} cards from Scryfall`);
    const result = new Array<IScryfallCardDto>();
    // split array
    const chunks = cardIds.reduce(
      (resultArray: Array<Array<string>>, item, index) => {
        const chunkIndex = Math.floor(index / this.scryfallConfiguration.collectionChunkSize);
        if (!resultArray[chunkIndex]) {
          resultArray[chunkIndex] = []; // start a new chunk
        }
        resultArray[chunkIndex].push(item);
        return resultArray;
      },
      []
    );

    await runSerial<Array<string>>(
      chunks,
      async (chunk: Array<string>, index: number, _total: number) => {
        const first = (this.scryfallConfiguration.collectionChunkSize * index) + 1;
        const last = first + chunk.length - 1;
        progressCallback(`Fetching cards ${first} - ${last} of ${cardIds.length} from Scryfall`);
        const fetched = await this.tryPost(
          `${this.scryfallConfiguration.scryfallApiRoot}/${this.scryfallConfiguration.scryfallEndpoints["collection"]}`,
          JSON.stringify({
            identifiers: chunk.map((id: string) => {
              return { id: id };
            })
          })
        );
        result.push(...fetched);
      }
    );
    return result;
  }

  public async getCardSets(progressCallback: ProgressCallback): Promise<Array<IScryfallCardSetDto>> {
    progressCallback("Fetching card set data from Scryfall");
    const uri = `${this.scryfallConfiguration.scryfallApiRoot}/${this.scryfallConfiguration.scryfallEndpoints["cardSet"]}`;
    return this.fetchList<IScryfallCardSetDto>(uri, new Array<IScryfallCardSetDto>());
  }

  public getCardSymbols(progressCallback: ProgressCallback): Promise<Array<IScryfallCardSymbolDto>> {
    progressCallback("Fetching card symbol data from Scryfall");
    const uri = `${this.scryfallConfiguration.scryfallApiRoot}/${this.scryfallConfiguration.scryfallEndpoints["cardSymbol"]}`;
    return this.fetchList<IScryfallCardSymbolDto>(uri, new Array<IScryfallCardSymbolDto>());
  }

  public async getRulings(cardId: string): Promise<Array<IScryfallRulingDto>> {
    const uri = `${this.scryfallConfiguration.scryfallApiRoot}/${this.scryfallConfiguration.scryfallEndpoints["ruling"].replace(":id", cardId)}`;
    return this.fetchList<IScryfallRulingDto>(uri, new Array<IScryfallRulingDto>());
  }
  //#endregion

  //#region private methods ---------------------------------------------------
  private async tryFetch(uri: string | URL): Promise<Response> {
    const now = Date.now();
    const sleepTime = this.nextQuery - now;
    this.nextQuery = now + this.scryfallConfiguration.minimumRequestTimeout;
    return await this
      .sleep(sleepTime)
      .then(() => {
        this.logService.debug("Main", `fetch ${uri}`);
        return fetch(uri);
      })
      .then((result: Response) => {
        this.logService.debug("Main", `retrieved ${uri} -> status: ${result.status}`);
        return result;
      });
  }

  private async tryPost(uri: string | URL, body: string): Promise<Array<IScryfallCardDto>> {
    const now = Date.now();
    const sleepTime = this.nextQuery - now;
    this.nextQuery = now + this.scryfallConfiguration.minimumRequestTimeout;
    this.logService.debug("Main", `POST ${uri} - body\n${JSON.stringify(body, null, 2)}`);
    return await this
      .sleep(sleepTime)
      .then(() => fetch(uri, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: body
      }))
      .then(async (response: Response) => {
        this.logService.debug("Main", `retrieved ${uri} -> status: ${response.status}`);
        return ((await response.json()) as IScryfallListDto<IScryfallCardDto>).data;
      });
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
      this.logService.debug("Main", `sleeping ${ms}`);
      setTimeout(resolve, ms);
    });
  }

  private async fetchList<T extends object>(uri: string | URL, previousPages: Array<T>, progressCallback?: ProgressCallback): Promise<Array<T>> {
    return this.tryFetch(uri)
      .then(async (response: Response) => {
        const fetchedList = (await response.json()) as IScryfallListDto<T>;
        previousPages.push(...fetchedList.data);
        if (fetchedList.has_more && fetchedList.next_page) {
          return this.fetchList(fetchedList.next_page, previousPages, progressCallback);
        } else {
          return previousPages;
        }
      });
  }

  private buildCardBySetUri(cardSetCode: string, scryfallOptions: IScryfallSearchOptionsDto): URL {
    const result = new URL(`${this.scryfallConfiguration.scryfallApiRoot}/${this.scryfallConfiguration.scryfallEndpoints["search"]}`);
    result.searchParams.set("include_extras", scryfallOptions.include_extras ? "true" : "false");
    result.searchParams.set("unique", scryfallOptions.unique);
    result.searchParams.set("include_multilingual", scryfallOptions.include_multilingual ? "true" : "false");
    result.searchParams.set("include_variations", scryfallOptions.include_variations ? "true" : "false");
    const query = new Array<string>();
    query.push(`e=${cardSetCode}`);
    query.push("lang=any");
    result.searchParams.set("q", query.join("+"));
    return result;
  }
  //#endregion
}
