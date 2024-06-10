import { SVG, cleanupSVG, parseColors } from "@iconify/tools";
import { net } from "electron";
import * as fs from "fs";
import { Selectable } from "kysely";
import * as path from "path";
import { inject, injectable } from "tsyringe";

import { CardImageDto } from "../../../../common/dto";
import { ProgressCallback } from "../../../../common/ipc-params";
import { CardSetTable, CardSymbolTable } from "../../../../main/database/schema";
import SCRYTOKENS, { IScryfallClient } from "../../scryfall/client/interfaces";
import INFRATOKENS, { IConfigurationService, IImageCacheService } from "../interfaces";


@injectable()
export class ImageCacheService implements IImageCacheService {

  //#region Private readonly fields -------------------------------------------
  private readonly configurationService: IConfigurationService;
  private readonly apiClient: IScryfallClient;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(
    @inject(INFRATOKENS.ConfigurationService) configurationService: IConfigurationService,
    @inject(SCRYTOKENS.ScryfallClient) apiClient: IScryfallClient) {
    this.configurationService = configurationService;
    this.apiClient = apiClient;
  }
  //#endregion

  //#region IImageCacheService methods ----------------------------------------
  public async cacheCardSymbolSvg(cardSymbol: Selectable<CardSymbolTable>, progressCallback: ProgressCallback): Promise<void> {
    console.log(`  -> start cache svg for symbol '${cardSymbol.english}'`);
    progressCallback(`Caching image for '${cardSymbol.english}'`);
    return this.apiClient.fetchSvg(cardSymbol.svg_uri)
      .then((arrayBuffer: ArrayBuffer) => {
        const buffer = Buffer.from(arrayBuffer);
        fs.createWriteStream(this.pathToCardSymbolSvg(cardSymbol)).write(buffer);
      });
  }

  public async cacheCardSetSvg(cardSet: Selectable<CardSetTable>, progressCallback: ProgressCallback): Promise<void> {
    console.log(`  -> start cache svg for cardset '${cardSet.name}'`);
    progressCallback(`Caching image for '${cardSet.name}'`);
    await this.apiClient.fetchSvg(cardSet.icon_svg_uri)
      .then((arrayBuffer: ArrayBuffer) => {
        const enc = new TextDecoder("utf-8");
        const asString = enc.decode(arrayBuffer);
        return fs.promises.writeFile(this.pathToCardSetSvg(cardSet), this.hackCardSetSvg(asString));
      })
      .catch((reason) => console.log(`failed ${cardSet.name}`, reason));
  }

  public deleteCachedCardImage(card: CardImageDto): void {
    const cachePath = this.pathToCachedCardImage(card);
    if (fs.existsSync(cachePath)) {
      fs.unlinkSync(cachePath);
    }
  }

  public async getAsset(path: string): Promise<string> {
    return Promise.resolve(fs.readFileSync(path, { encoding: "utf-8" }));
  }

  public async getCardImage(card: CardImageDto): Promise<Response> {
    const cachePath = this.pathToCachedCardImage(card);
    if (fs.existsSync(cachePath)) {
      return net.fetch(cachePath);
    } else {
      return this.fetchAndCacheCardImage(cachePath, card.imageUri)
        .then(() => net.fetch(cachePath));
    }
  }

  public cacheCardImage(card: CardImageDto, onlyIfExists: boolean): Promise<void> {
    const cachePath = this.pathToCachedCardImage(card);
    if(!onlyIfExists){
      return this.fetchAndCacheCardImage(cachePath, card.imageUri);
    } else if (fs.existsSync(cachePath)) {
      return this.fetchAndCacheCardImage(cachePath, card.imageUri);
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
  private async fetchAndCacheCardImage(cachePath: string, url: string): Promise<void> {
    return this.apiClient.fetchSvg(url)
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

  private pathToCachedCardImage(card: CardImageDto): string {
    const fileName = `${card.collectorNumber.padStart(3, "0")}.${card.sequence}${path.extname(new URL(card.imageUri).pathname.split("/").pop())}`;
    const dirName = path.join(this.configurationService.cacheDirectory, "cards", card.setCode, card.language, card.imageType);
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
