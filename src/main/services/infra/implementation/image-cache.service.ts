import { SVG, cleanupSVG, parseColors } from "@iconify/tools";
import { net } from "electron";
import { createWriteStream, existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "fs";
import { Selectable } from "kysely";
import * as path from "path";
import { inject, injectable } from "tsyringe";
import { IMtgCardImageDataDto } from "../../../../common/dto";
import { ProgressCallback } from "../../../../common/ipc";
import { CardSetTable, CardSymbolTable } from "../../../../main/database/schema";
import { IResult } from "../../base";
import { IScryfallClient } from "../../scryfall/client/interfaces";
import { INFRASTRUCTURE, SCRYFALL } from "../../service.tokens";
import { IConfigurationService, IImageCacheService, ILogService, IResultFactory } from "../interfaces";


@injectable()
export class ImageCacheService implements IImageCacheService {
  //#region Private readonly fields -------------------------------------------
  private readonly configurationService: IConfigurationService;
  private readonly apiClient: IScryfallClient;
  private readonly logService: ILogService;
  private readonly resultFactory: IResultFactory;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(
    @inject(INFRASTRUCTURE.ConfigurationService) configurationService: IConfigurationService,
    @inject(SCRYFALL.ScryfallClient) apiClient: IScryfallClient,
    @inject(INFRASTRUCTURE.LogService) logService: ILogService,
    @inject(INFRASTRUCTURE.ResultFacotry) resultFactory: IResultFactory
  ) {
    this.configurationService = configurationService;
    this.apiClient = apiClient;
    this.logService = logService;
    this.resultFactory = resultFactory;
  }
  //#endregion

  //#region IImageCacheService methods ----------------------------------------
  public async cacheCardSymbolSvg(cardSymbol: Selectable<CardSymbolTable>, progressCallback: ProgressCallback): Promise<void> {
    progressCallback(`Caching image for '${cardSymbol.english}'`);
    return this.apiClient.fetchArrayBuffer(cardSymbol.svg_uri)
      .then((arrayBuffer: ArrayBuffer) => {
        const buffer = Buffer.from(arrayBuffer);
        createWriteStream(this.pathToCardSymbolSvg(cardSymbol)).write(buffer);
      });
  }

  public async cacheCardSetSvg(cardSet: Selectable<CardSetTable>, progressCallback: ProgressCallback): Promise<void> {
    progressCallback(`Caching image for '${cardSet.name}'`);
    await this.apiClient.fetchArrayBuffer(cardSet.icon_svg_uri)
      .then((arrayBuffer: ArrayBuffer) => {
        const enc = new TextDecoder("utf-8");
        const asString = enc.decode(arrayBuffer);
        return Promise.resolve(writeFileSync(this.pathToCardSetSvg(cardSet), this.hackCardSetSvg(asString)));
      })
      .catch((reason) => this.logService.error("Main", `failed ${cardSet.name}`, reason));
  }

  public deleteCachedCardImage(card: IMtgCardImageDataDto): void {
    const cachePath = this.pathToCachedCardImage(card);
    if (existsSync(cachePath)) {
      unlinkSync(cachePath);
    }
  }

  public async getAsset(path: string): Promise<IResult<string>> {
    if (existsSync(path)) {
      try {
        return this.resultFactory.createSuccessResultPromise<string>(readFileSync(path, { encoding: "utf-8" }));
      } catch (err) {
        return this.resultFactory.createExceptionResultPromise<string>(err);
      }
    } else {
      return this.resultFactory.createNotFoundResultPromise<string>(path);
    }
  }

  public async getCardImage(card: IMtgCardImageDataDto): Promise<Response> {
    const cachePath = this.pathToCachedCardImage(card);
    if (existsSync(cachePath)) {
      return net.fetch(cachePath);
    } else {
      return this.fetchAndCacheCardImage(cachePath, card)
        .then(() => net.fetch(cachePath));
    }
  }

  public cacheCardImage(card: IMtgCardImageDataDto, onlyIfExists: boolean): Promise<void> {
    const cachePath = this.pathToCachedCardImage(card);
    if (!onlyIfExists) {
      return this.fetchAndCacheCardImage(cachePath, card);
    } else if (existsSync(cachePath)) {
      return this.fetchAndCacheCardImage(cachePath, card);
    }
  }

  public getCardSymbolSvg(cardSymbol: Selectable<CardSymbolTable>): string {
    return readFileSync(this.pathToCardSymbolSvg(cardSymbol), { encoding: "utf-8" });
  }

  public getCardSetSvg(cardSet: Selectable<CardSetTable>): string {
    return readFileSync(this.pathToCardSetSvg(cardSet), { encoding: "utf-8" });
  }
  //#endregion

  //#region Private methods ---------------------------------------------------
  private async fetchAndCacheCardImage(cachePath: string, card: IMtgCardImageDataDto): Promise<void> {
    return this.apiClient.getCardImage(card)
      .then((arrayBuffer: ArrayBuffer) => {
        const buffer = Buffer.from(arrayBuffer);
        return Promise.resolve(writeFileSync(cachePath, buffer));
      });
  }

  private pathToCardSymbolSvg(cardSymbol: Selectable<CardSymbolTable>): string {
    const fileName = new URL(cardSymbol.svg_uri).pathname.split("/").pop();
    const dirName = path.join(this.configurationService.configuration.dataConfiguration.cacheDirectory, "cardsymbols");
    if (!existsSync(dirName)) {
      mkdirSync(dirName, { recursive: true });
    }
    return path.join(dirName, fileName);
  }

  private pathToCachedCardImage(card: IMtgCardImageDataDto): string {
    let fileName: string;
    let dirName: string;

    if (card.side == "front" || (card.side == "back" && !card.cardBackId)) {
      dirName = path.join(this.configurationService.configuration.dataConfiguration.cacheDirectory, "cards", card.setCode, card.language, card.imageType);
      fileName = `${card.collectorNumber.padStart(3, "0")}.${card.side}.jpg`;
    } else {
      dirName = path.join(this.configurationService.configuration.dataConfiguration.cacheDirectory, "cards", "backsides");
      fileName = `${card.cardBackId}.jpg`;
    }

    if (!existsSync(dirName)) {
      mkdirSync(dirName, { recursive: true });
    }
    return path.join(dirName, fileName);
  }

  private pathToCardSetSvg(cardSet: Selectable<CardSetTable>): string {
    const fileName = `${cardSet.code}${path.extname(new URL(cardSet.icon_svg_uri).pathname.split("/").pop())}`;
    const dirName = path.join(this.configurationService.configuration.dataConfiguration.cacheDirectory, "sets");
    if (!existsSync(dirName)) {
      mkdirSync(dirName, { recursive: true });
    }
    return path.join(dirName, fileName);
  }

  private hackCardSetSvg(source: string): string {
    const svg = new SVG(source);
    cleanupSVG(svg);
    parseColors(svg, {
      // Change default color to 'currentColor'
      defaultColor: "currentColor",
      callback: () => "currentColor"
    });
    return svg.toMinifiedString();
  }
  //#endregion
}
