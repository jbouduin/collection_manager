import { DtoDatabaseTreeViewConfiguration } from "../../../../common/dto";
import { CardSetGroupBy, CardSetSort, CardSetType } from "../../../../common/enums";
import { BaseViewmodel } from "../base.viewmodel";

export class DatabaseViewTreeConfigurationViewmodel extends BaseViewmodel<DtoDatabaseTreeViewConfiguration> {
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

  public get cardSetTypeFilter(): Array<CardSetType> {
    return this._dto.cardSetTypeFilter;
  }
  //#endregion

  //#region Constructor -------------------------------------------------------
  public constructor(dtoConfiguration: DtoDatabaseTreeViewConfiguration) {
    super(dtoConfiguration);
  }
  //#endregion

  //#region Public methods ----------------------------------------------------
  public toggleCardSetFilterType(cardSetType: CardSetType): void {
    const indexOfType = this._dto.cardSetTypeFilter.indexOf(cardSetType);
    if (indexOfType >= 0) {
      this._dto.cardSetTypeFilter = this._dto.cardSetTypeFilter
        .filter((ct: CardSetType) => ct != cardSetType);
    } else {
      this._dto.cardSetTypeFilter.push(cardSetType);
    }
  }
  //#endregion
}
