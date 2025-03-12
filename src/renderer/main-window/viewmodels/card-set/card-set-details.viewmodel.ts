import { IMtgCardSetDetailDto, IMtgCardSetLanguageDto, ILanguageDto } from "../../../../common/dto";
import { CardSetType } from "../../../../common/types";


export class CardSetDetailsViewmodel {
  //#region Private fields ----------------------------------------------------
  private _dtoCardSet: IMtgCardSetDetailDto;
  //#endregion

  //#region Public getters ----------------------------------------------------
  public get block(): string {
    return this._dtoCardSet.block;
  }

  public get cardSetName(): string {
    return this._dtoCardSet.name;
  }

  public get cardSetType(): CardSetType {
    return this._dtoCardSet.set_type;
  }

  public get lastFullSynchronizationString(): string {
    return this._dtoCardSet.last_full_synchronization_at
      ? this._dtoCardSet.last_full_synchronization_at.toLocaleString()
      : "Never";
  }

  public get numberOfPrintedCards(): number {
    return this._dtoCardSet.card_count;
  }

  public get numberOfUniqueCards(): number {
    return this._dtoCardSet.unique_cards;
  }

  public get releaseDateString(): string {
    return this._dtoCardSet.released_at.toLocaleDateString();
  }

  public get scryFallUri(): string {
    return this._dtoCardSet.scryfall_uri;
  }


  public get isMultiLanguage(): boolean {
    return this._dtoCardSet.languages.length > 1;
  }

  public get isFullSynchronized(): boolean {
    return this._dtoCardSet.last_full_synchronization_at ? true : false;
  }

  public get languagesWithNumberOfCards(): Array<IMtgCardSetLanguageDto> {
    return this._dtoCardSet.languages;
  }

  public get foilOnly(): boolean {
    return this._dtoCardSet.is_foil_only;
  }

  public get nonFoilOnly(): boolean {
    return this._dtoCardSet.is_nonfoil_only;
  }

  public get digital(): boolean {
    return this._dtoCardSet.is_digital;
  }

  public get mtgOnlineCode(): string {
    return this._dtoCardSet.mtgo_code ?? "-";
  }

  public get tcgPlayerId(): string {
    return this._dtoCardSet.tcgplayer_id?.toString() ?? "-";
  }

  public get arenaCode(): string {
    return this._dtoCardSet.arena_code ?? "-";
  }
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(dtoCardSetDetails: IMtgCardSetDetailDto) {
    this._dtoCardSet = dtoCardSetDetails;
  }
  //#endregion

  //#region Public methods ----------------------------------------------------
  public getLanguagesOfSet(languages: Array<ILanguageDto>): string {
    return this._dtoCardSet.languages
      .map((language: IMtgCardSetLanguageDto) => languages.find((dtoLanguage: ILanguageDto) => dtoLanguage.id == language.lang).button_text)
      .join(", ");
  }
  //#endregion
}
