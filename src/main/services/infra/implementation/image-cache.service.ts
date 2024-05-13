import { net } from "electron";
import * as fs from "fs";
import * as path from "path";
import { inject, injectable } from "tsyringe";

import { CardImageSelectDto, SymbologySelectDto } from "../../../../common/dto";
import INFRATOKENS, { IConfigurationService, IImageCacheService } from "../interfaces";

@injectable()
export class ImageCacheService implements IImageCacheService {

  private readonly configurationService: IConfigurationService;

  public constructor(
    @inject(INFRATOKENS.ConfigurationService) configurationService: IConfigurationService) {
    this.configurationService = configurationService;
  }

  public async cacheCardImage(card: CardImageSelectDto): Promise<void> {
    return fetch(card.uri)
      .then((response: Response) => response.arrayBuffer())
      .then((arrayBuffer: ArrayBuffer) => {
        const buffer = Buffer.from(arrayBuffer);
        fs.createWriteStream(this.pathToCachedCardImage(card)).write(buffer);
      });
  }

  // NOW input parameter can be Symbology
  public async cacheSymbologyImage(cardSymbol: SymbologySelectDto): Promise<void> {
    return fetch(cardSymbol.symbology.svg_uri)
      .then((response: Response) => response.arrayBuffer())
      .then((arrayBuffer: ArrayBuffer) => {
        console.log(`ready to write ${this.pathToCachedCardSymbolImage(cardSymbol)}`);
        const buffer = Buffer.from(arrayBuffer);
        fs.createWriteStream(this.pathToCachedCardSymbolImage(cardSymbol)).write(buffer);
      });
  }

  public async getCachedImage(localUrl: string): Promise<Response> {
    return net.fetch(localUrl);
  }

  // NOW input parameter can be Symbology
  public getCardSymbolSvg(cardSymbol: SymbologySelectDto): string {
    return fs.readFileSync(this.pathToCachedCardSymbolImage(cardSymbol), { encoding: "utf-8" });
  }


  // NOW input parameter can be Symbology
  public pathToCachedCardSymbolImage(cardSymbol: SymbologySelectDto): string {
    const fileName = new URL(cardSymbol.symbology.svg_uri).pathname.split("/").pop();
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
}
