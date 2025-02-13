import { SVG, cleanupSVG, parseColors } from "@iconify/tools";
import { net } from "electron";
import * as fs from "fs";
import { Selectable } from "kysely";
import * as path from "path";
import { inject, injectable } from "tsyringe";
import { DtoCardImageData } from "../../../../common/dto";
import { ProgressCallback } from "../../../../common/ipc-params";
import { CardSetTable, CardSymbolTable } from "../../../../main/database/schema";
import { IScryfallClient } from "../../scryfall/client/interfaces";
import { IConfigurationService, IImageCacheService, ILogService } from "../interfaces";
import { SCRYFALL, INFRASTRUCTURE } from "../../service.tokens";


@injectable()
export class ImageCacheService implements IImageCacheService {
  //#region Private readonly fields -------------------------------------------
  private readonly configurationService: IConfigurationService;
  private readonly apiClient: IScryfallClient;
  private readonly logService: ILogService;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(
    @inject(INFRASTRUCTURE.ConfigurationService) configurationService: IConfigurationService,
    @inject(SCRYFALL.ScryfallClient) apiClient: IScryfallClient,
    @inject(INFRASTRUCTURE.LogService) logService: ILogService
  ) {
    this.configurationService = configurationService;
    this.apiClient = apiClient;
    this.logService = logService;
  }
  //#endregion

  //#region IImageCacheService methods ----------------------------------------
  public async cacheCardSymbolSvg(cardSymbol: Selectable<CardSymbolTable>, progressCallback: ProgressCallback): Promise<void> {
    progressCallback(`Caching image for '${cardSymbol.english}'`);
    return this.apiClient.fetchArrayBuffer(cardSymbol.svg_uri)
      .then((arrayBuffer: ArrayBuffer) => {
        const buffer = Buffer.from(arrayBuffer);
        fs.createWriteStream(this.pathToCardSymbolSvg(cardSymbol)).write(buffer);
      });
  }

  public async cacheCardSetSvg(cardSet: Selectable<CardSetTable>, progressCallback: ProgressCallback): Promise<void> {
    progressCallback(`Caching image for '${cardSet.name}'`);
    await this.apiClient.fetchArrayBuffer(cardSet.icon_svg_uri)
      .then((arrayBuffer: ArrayBuffer) => {
        const enc = new TextDecoder("utf-8");
        const asString = enc.decode(arrayBuffer);
        return fs.promises.writeFile(this.pathToCardSetSvg(cardSet), this.hackCardSetSvg(asString));
      })
      .catch((reason) => this.logService.error("Main", `failed ${cardSet.name}`, reason));
  }

  public deleteCachedCardImage(card: DtoCardImageData): void {
    const cachePath = this.pathToCachedCardImage(card);
    if (fs.existsSync(cachePath)) {
      fs.unlinkSync(cachePath);
    }
  }

  public async getAsset(path: string): Promise<string> {
    return Promise.resolve(fs.readFileSync(path, { encoding: "utf-8" }));
  }

  public async getCardImage(card: DtoCardImageData): Promise<Response> {
    const cachePath = this.pathToCachedCardImage(card);
    if (fs.existsSync(cachePath)) {
      return net.fetch(cachePath);
    } else {
      return this.fetchAndCacheCardImage(cachePath, card)
        .then(() => net.fetch(cachePath));
    }
  }

  public cacheCardImage(card: DtoCardImageData, onlyIfExists: boolean): Promise<void> {
    const cachePath = this.pathToCachedCardImage(card);
    if (!onlyIfExists) {
      return this.fetchAndCacheCardImage(cachePath, card);
    } else if (fs.existsSync(cachePath)) {
      return this.fetchAndCacheCardImage(cachePath, card);
    }
  }

  public getCardSymbolSvg(cardSymbol: Selectable<CardSymbolTable>): string {
    return fs.readFileSync(this.pathToCardSymbolSvg(cardSymbol), { encoding: "utf-8" });
  }

  public getCardSetSvg(cardSet: Selectable<CardSetTable>): string {
    return fs.readFileSync(this.pathToCardSetSvg(cardSet), { encoding: "utf-8" });
  }
  //#endregion

  //#region Private methods ---------------------------------------------------
  private async fetchAndCacheCardImage(cachePath: string, card: DtoCardImageData): Promise<void> {
    return this.apiClient.getCardImage(card)
      .then((arrayBuffer: ArrayBuffer) => {
        const buffer = Buffer.from(arrayBuffer);
        return fs.promises.writeFile(cachePath, buffer);
      });
  }

  private pathToCardSymbolSvg(cardSymbol: Selectable<CardSymbolTable>): string {
    const fileName = new URL(cardSymbol.svg_uri).pathname.split("/").pop();
    const dirName = path.join(this.configurationService.cacheDirectory, "cardsymbols");
    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName, { recursive: true });
    }
    return path.join(dirName, fileName);
  }

  private pathToCachedCardImage(card: DtoCardImageData): string {
    let fileName: string;
    let dirName: string;

    if (card.side == "front" || (card.side == "back" && !card.cardBackId)) {
      dirName = path.join(this.configurationService.cacheDirectory, "cards", card.setCode, card.language, card.imageType);
      fileName = `${card.collectorNumber.padStart(3, "0")}.${card.side}.jpg`;
    } else {
      dirName = path.join(this.configurationService.cacheDirectory, "cards", "backsides");
      fileName = `${card.cardBackId}.jpg`;
    }

    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName, { recursive: true });
    }
    return path.join(dirName, fileName);
  }

  private pathToCardSetSvg(cardSet: Selectable<CardSetTable>): string {
    const fileName = `${cardSet.code}${path.extname(new URL(cardSet.icon_svg_uri).pathname.split("/").pop())}`;
    const dirName = path.join(this.configurationService.cacheDirectory, "sets");
    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName, { recursive: true });
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
