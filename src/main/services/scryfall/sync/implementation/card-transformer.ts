import { Transform, TransformCallback, TransformOptions } from "stream";
import { IScryfallCardDto } from "../../dto";
import { ILogService } from "../../../infra/interfaces";


export class CardTransformer extends Transform {
  //#region Private fields ----------------------------------------------------
  private readonly splitString: string;
  private readonly logService: ILogService;
  private lastLineData: string;
  //#endregion

  //#region Constructor -------------------------------------------------------
  public constructor(options: TransformOptions, logService: ILogService) {
    super({ ...options, objectMode: true });
    this.logService = logService;
    this.lastLineData = "";
    this.splitString = "{\"object\":\"card\"";
  }
  //#endregion

  //#region Mandatory overrides -----------------------------------------------
  public override _transform(chunk: unknown, _encoding: BufferEncoding, callback: TransformCallback): void {
    /* eslint-disable-next-line @typescript-eslint/no-base-to-string */
    let data = String(chunk);
    if (this.lastLineData) {
      data = this.lastLineData + data;
    }

    const cards = data.split(this.splitString);
    this.lastLineData = cards.pop();

    cards.forEach((card: string) => {
      const restoredCard = `${this.splitString}${card.trimEnd()}`.slice(0, -1);
      try {
        this.push(JSON.parse(restoredCard) as IScryfallCardDto);
      } catch (err) {
        this.logService.error("Main", "Error parsing card", err);
      }
    });
    callback();
  }

  public override _flush(callback: TransformCallback): void {
    if (this.lastLineData) {
      try {
        const restoredCard = `${this.splitString}${this.lastLineData.trimEnd()}`.slice(0, -1);
        this.push(JSON.parse(restoredCard));
      } catch (err) {
        this.logService.error("Main", "Error parsing card", err);
      }
    }
    this.lastLineData = "";
    callback();
  }
  //#endregion
}
