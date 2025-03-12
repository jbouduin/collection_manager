import { IColorDto, IDeckDto, IDeckListDto } from "../../../../common/dto";
import { MtgGameFormat } from "../../../../common/types";

export class DeckListViewmodel {
  //#region private fields ----------------------------------------------------
  private readonly _deck: IDeckListDto;
  private readonly _colorIdentity: Array<string>;
  private readonly _coloridentitySortValue: string;
  //#endregion

  //#region Getters/Setters ---------------------------------------------------
  public get colorIdentity(): Array<string> {
    return this._colorIdentity;
  }

  public get coloridentitySortValue(): string {
    return this._coloridentitySortValue;
  }

  public get id(): number {
    return this._deck.id;
  }

  public get name(): string {
    return this._deck.name;
  }

  public get targetFormat(): MtgGameFormat {
    return this._deck.target_format;
  }
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public static deckListViewmodel(deck: IDeckListDto): DeckListViewmodel {
    return new DeckListViewmodel(deck);
  }

  public static newDeckListViewmodel(deck: IDeckDto): DeckListViewmodel {
    const newListDto: IDeckListDto = {
      ...deck,
      deckSize: 0,
      sideboardSize: 0,
      accumulatedColorIdentity: new Array<Pick<IColorDto, "sequence" | "mana_symbol">>()
    };
    return new DeckListViewmodel(newListDto);
  }

  private constructor(deck: IDeckListDto) {
    this._deck = deck;
    const deckColors = this._deck.accumulatedColorIdentity
      .sort((a: Pick<IColorDto, "sequence" | "mana_symbol">, b: Pick<IColorDto, "sequence" | "mana_symbol">) => a.sequence - b.sequence);
    this._colorIdentity = deckColors
      .map((cardColor: Pick<IColorDto, "sequence" | "mana_symbol">) => cardColor.mana_symbol);
    this._coloridentitySortValue = "";
    for (const item of deckColors) {
      this._coloridentitySortValue = this._coloridentitySortValue + item.sequence.toString().padStart(2, "0");
    }
  }
  //#endregion
}
