import { DeckListDto } from "../../../../common/dto";
import { GameFormat } from "../../../../common/types";

export class DeckListViewmodel {
  //#region private fields ----------------------------------------------------
  private readonly _deck: DeckListDto;
  //#endregion

  public get name(): string {
    return this._deck.name;
  }

  public get targetFormat(): GameFormat {
    return this._deck.target_format;
  }

  //#region Constructor & C° --------------------------------------------------
  public constructor(deck: DeckListDto) {
    this._deck = deck;
  }
  //#endregion
}
