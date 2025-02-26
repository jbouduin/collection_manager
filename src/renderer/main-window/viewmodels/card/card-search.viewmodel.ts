import { BaseViewmodel } from "../../../common/viewmodels/base.viewmodel";


/**
 * Define a dto, se we can later save searches
 */
export interface CardSearchDto {
  selectedSets: Array<string>;
}

export class CardSearchViewmodel extends BaseViewmodel<CardSearchDto> {
//#region Getters - Setters ---------------------------------------------------
  public get selectedSets(): Array<string> {
    return this._dto.selectedSets;
  }
  //#endregion

  //#region Constructor -------------------------------------------------------
  public constructor() {
    const initial: CardSearchDto = {
      selectedSets: new Array<string>()
    };
    super(initial);
  }
  //#endregion

  //#region Card set ----------------------------------------------------------
  public addCardSet(cardSetId: string): void {
    this._dto.selectedSets.push(cardSetId);
  }

  public removeCardSet(cardSetId: string): void {
    const idx = this._dto.selectedSets.indexOf(cardSetId);
    this._dto.selectedSets.splice(idx, 1);
  }

  public clearCardSetSelection(): void {
    this._dto.selectedSets = new Array<string>();
  }
  //#endregion

  //#region Public methods ----------------------------------------------------
  public toQueryString(): string {
    const queryParts = new Array<string>();
    if (this._dto.selectedSets.length > 0) {
      queryParts.push(`sets=${this._dto.selectedSets.join(",")}`);
    }
    return queryParts.join("&");
  }
  //#endregion
}
