import { cloneDeep, isEqual } from "lodash";

import { DtoDatabaseViewConfiguration } from "../../../../common/dto";
import { CardSetGroupBy, CardSetSort, CardSetType } from "../../../../common/enums";

export class DatabaseViewConfigurationViewmodel {
  private _dtoConfiguration: DtoDatabaseViewConfiguration;
  private _orgConfiguration: DtoDatabaseViewConfiguration;

  //#region Auxiliary getters -------------------------------------------------
  public get dto(): DtoDatabaseViewConfiguration {
    return this._dtoConfiguration;
  }
  public get hasChanges(): boolean {
    return !isEqual(this._dtoConfiguration, this._orgConfiguration);
  }
  //#endregion

  //#region Getters/Setters ---------------------------------------------------
  public get cardSetSort(): CardSetSort {
    return this._dtoConfiguration.cardSetSort;
  }

  public set cardSetSort(value: CardSetSort) {
    this._dtoConfiguration.cardSetSort = value;
  }

  public get cardSetGroupBy(): CardSetGroupBy {
    return this._dtoConfiguration.cardSetGroupBy;
  }

  public set cardSetGroupBy(value: CardSetGroupBy) {
    this._dtoConfiguration.cardSetGroupBy = value;
  }
  //#endregion

  //#region Constructor -------------------------------------------------------
  public constructor(dtoConfiguration: DtoDatabaseViewConfiguration) {
    this._dtoConfiguration = dtoConfiguration;
    this._orgConfiguration = cloneDeep(dtoConfiguration);
  }
  //#endregion

  //#region Public methods ----------------------------------------------------
  public getCardSetTypeFilter(cardSetType: CardSetType): boolean {
    return this._dtoConfiguration.cardSetTypeFilter[cardSetType];
  }

  public setCardSetTypeFilter(cardSetType: CardSetType, value: boolean) {
    this._dtoConfiguration.cardSetTypeFilter[cardSetType] = value;
  }
  //#endregion
}
