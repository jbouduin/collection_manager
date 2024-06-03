import { CardSetType, CardSetTypeDisplayValue } from "../../../../common/enums";
import { DtoCardSetDetails, DtoCardSetLanguage, DtoLanguage } from "../../../../common/dto";


export class CardSetDetailsViewmodel {
  //#region Private fields ----------------------------------------------------
  private _dtoCardSet: DtoCardSetDetails;
  //#endregion

  //#region Public getters ----------------------------------------------------
  public get block(): string {
    return this._dtoCardSet.block;
  }

  public get cardSetName(): string {
    return this._dtoCardSet.name;
  }

  public get cardSetType(): string {
    return CardSetTypeDisplayValue.get(this._dtoCardSet.set_type);
  }

  public get lastFullSynchronization(): string {
    // TODO date and datetime issues
    return this._dtoCardSet.last_full_synchronization ?
      new Date(this._dtoCardSet.last_full_synchronization).toLocaleString() :
      "Never";
  }

  public get numberOfPrintedCards(): number {
    return this._dtoCardSet.card_count;
  }

  public get numberOfUniqueCards(): number {
    return this._dtoCardSet.unique_cards;
  }

  public get releaseDate(): Date {
    // TODO date and datetime issues
    return new Date(this._dtoCardSet.released_at);
  }

  public get scryFallUri(): string {
    return this._dtoCardSet.scryfall_uri;
  }


  public get isMultiLanguage(): boolean {
    return this._dtoCardSet.languages.length > 1;
  }

  public get isFullSynchronized(): boolean {
    return this._dtoCardSet.last_full_synchronization ? true : false;
  }

  public get languagesWithNumberOfCards(): Array<DtoCardSetLanguage> {
    return this._dtoCardSet.languages;
  }

  public get foilOnly(): boolean {
    return this._dtoCardSet.foil_only == true;
  }

  public get nonFoilOnly(): boolean {
    return this._dtoCardSet.nonfoil_only == true;
  }

  public get digital(): boolean {
    return this._dtoCardSet.digital == true;
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
  public constructor(dtoCardSetDetails: DtoCardSetDetails) {
    this._dtoCardSet = dtoCardSetDetails;
  }
  //#endregion

  //#region Public methods ----------------------------------------------------
  public getLanguagesOfSet(languages: Array<DtoLanguage>): string {
    return this._dtoCardSet.languages
      .map((language: DtoCardSetLanguage) =>
        languages.find((dtoLanguage: DtoLanguage) => dtoLanguage.id == language.lang).button_text)
      .join(", ");
  }
  //#endregion
}
