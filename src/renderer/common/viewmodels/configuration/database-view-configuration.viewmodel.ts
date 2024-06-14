import { DtoDatabaseTreeViewConfiguration } from "../../../../common/dto";
import { CardSetGroupBy, CardSetSort, CardSetType } from "../../../../common/enums";
import { BaseViewmodel } from "../base.viewmodel";

export class DatabaseViewTreeConfigurationViewmodel extends BaseViewmodel < DtoDatabaseTreeViewConfiguration > {

  //#region Getters/Setters ---------------------------------------------------
  public get cardSetSort(): CardSetSort {
    return this._dto.cardSetSort;
  }

  public set cardSetSort(value: CardSetSort) {
    this._dto.cardSetSort = value;
  }

  public get cardSetGroupBy(): CardSetGroupBy {
    return this._dto.cardSetGroupBy;
  }

  public set cardSetGroupBy(value: CardSetGroupBy) {
    this._dto.cardSetGroupBy = value;
  }
  //#endregion

  //#region Constructor -------------------------------------------------------
  public constructor(dtoConfiguration: DtoDatabaseTreeViewConfiguration) {
    super(dtoConfiguration);
  }
  //#endregion

  //#region Public methods ----------------------------------------------------
  public getCardSetTypeFilter(cardSetType: CardSetType): boolean {
    return this._dto.cardSetTypeFilter.indexOf(cardSetType) >= 0;
  }

  public setCardSetTypeFilter(cardSetType: CardSetType, value: boolean) {
    if (value) {
      this._dto.cardSetTypeFilter.push(cardSetType);
    } else {
      this._dto.cardSetTypeFilter = this._dto.cardSetTypeFilter
        .filter((s: CardSetType) => s != cardSetType);
    }
  }
  //#endregion
}
