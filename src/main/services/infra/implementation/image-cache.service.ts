import { net } from "electron";
import * as fs from "fs";
import * as path from "path";
import { inject, injectable } from "tsyringe";

import { CardImageSelectDto } from "../../../../common/dto";
import INFRATOKENS, { IConfigurationService, IImageCacheService } from "../interfaces";
import { CardSet, Symbology } from "../../../../main/database/schema";
import SCRYTOKENS, { IApiClient } from "../../scryfall/interfaces";

@injectable()
export class ImageCacheService implements IImageCacheService {

  //#region Private readonly fields -------------------------------------------
  private readonly configurationService: IConfigurationService;
  private readonly apiClient: IApiClient;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(
    @inject(INFRATOKENS.ConfigurationService) configurationService: IConfigurationService,
    @inject(SCRYTOKENS.ApiClient) apiClient: IApiClient) {
    this.configurationService = configurationService;
    this.apiClient = apiClient;
  }
  //#endregion

  //#region IImageCacheService methods ----------------------------------------
  public async cacheCardImage(card: CardImageSelectDto): Promise<void> {
    return fetch(card.uri)
      .then((response: Response) => response.arrayBuffer())
      .then((arrayBuffer: ArrayBuffer) => {
        const buffer = Buffer.from(arrayBuffer);
        fs.createWriteStream(this.pathToCachedCardImage(card)).write(buffer);
      });
  }

  public async cacheCardSymbolSvg(cardSymbol: Symbology): Promise<void> {
    return this.apiClient.fetchSvg(cardSymbol.svg_uri)
      .then((arrayBuffer: ArrayBuffer) => {
        console.log(`ready to write ${this.pathToCardSymbolSvg(cardSymbol)}`);
        const buffer = Buffer.from(arrayBuffer);
        fs.createWriteStream(this.pathToCardSymbolSvg(cardSymbol)).write(buffer);
      });
  }

  public async cacheCardSetSvg(cardSet: CardSet): Promise<void> {
    await this.apiClient.fetchSvg(cardSet.icon_svg_uri)
      .then((arrayBuffer: ArrayBuffer) => {
        console.log(`ready to write ${this.pathToCardSetSvg(cardSet)}`);
        const buffer = Buffer.from(arrayBuffer);
        fs.createWriteStream(this.pathToCardSetSvg(cardSet)).write(buffer);
      })
      .catch((reason) => console.log(`failed ${cardSet.name}`));
  }

  public async getCachedImage(localUrl: string): Promise<Response> {
    return net.fetch(localUrl);
  }

  public getCardSymbolSvg(cardSymbol: Symbology): string {
    return fs.readFileSync(this.pathToCardSymbolSvg(cardSymbol), { encoding: "utf-8" });
  }
  //#endregion

  //#region Private methods ---------------------------------------------------
  public getCardSetSvg(cardSet: CardSet): string {
    return fs.readFileSync(this.pathToCardSetSvg(cardSet), { encoding: "utf-8" });
  }

  private pathToCardSymbolSvg(cardSymbol: Symbology): string {
    const fileName = new URL(cardSymbol.svg_uri).pathname.split("/").pop();
    const dirName = path.join(this.configurationService.cacheDirectory, "cardsymbols");
    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName, { recursive: true });
    }
    return path.join(dirName, fileName);
  }

  private pathToCachedCardImage(card: CardImageSelectDto): string {
    const fileName = `${card.collector_number.padStart(3)}.${path.extname(new URL(card.uri).pathname.split("/").pop())}`;
    const dirName = path.join(this.configurationService.cacheDirectory, "cards", card.code, card.lang, card.collector_number, card.image_type);
    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName, { recursive: true });
    }
    return path.join(dirName, fileName);
  }

  public pathToCardSetSvg(cardSet: CardSet): string {
    const fileName = `${cardSet.code}${path.extname(new URL(cardSet.icon_svg_uri).pathname.split("/").pop())}`;
    const dirName = path.join(this.configurationService.cacheDirectory, "sets");
    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName, { recursive: true });
    }
    return path.join(dirName, fileName);
  }
  //#endregion
}
