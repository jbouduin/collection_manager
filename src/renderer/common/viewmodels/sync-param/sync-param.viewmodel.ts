import { clone, isEqual } from "lodash";

import { CatalogType, ImageStatus } from "../../../../common/enums";
import { CardSyncType, DtoSyncParam, RulingSyncType, TimespanUnit } from "../../../../common/dto";


export class SyncParamViewmodel {

  //#region private fields ----------------------------------------------------
  private readonly _dtoSyncParam: DtoSyncParam;
  private readonly _orgSyncParam: DtoSyncParam;
  //#endregion

  //#region Auxiliary getters -------------------------------------------------
  public get dto(): DtoSyncParam {
    return this._dtoSyncParam;
  }
  public get hasChanges(): boolean {
    return !isEqual(this._dtoSyncParam, this._orgSyncParam);
  }
  //#endregion

  //#region Getters/Setters ---------------------------------------------------

  public get cardSyncType(): CardSyncType {
    return this._dtoSyncParam.cardSyncType;
  }

  public set cardSyncType(value: CardSyncType) {
    this._dtoSyncParam.cardSyncType = value;
  }

  public get rulingSyncType(): RulingSyncType {
    return this._dtoSyncParam.rulingSyncType;
  }

  public set rulingSyncType(value: RulingSyncType) {
    this._dtoSyncParam.rulingSyncType = value;
  }

  public get syncCardSets(): boolean {
    return this._dtoSyncParam.syncCardSets;
  }

  public set syncCardSets(value: boolean) {
    this._dtoSyncParam.syncCardSets = value;
  }

  public get syncCardsSyncedBeforeNumber(): number {
    return this._dtoSyncParam.syncCardsSyncedBeforeNumber;
  }

  public set syncCardsSyncedBeforeNumber(value: number) {
    this._dtoSyncParam.syncCardsSyncedBeforeNumber = value;
  }

  public get syncCardsSyncedBeforeUnit(): TimespanUnit {
    return this._dtoSyncParam.syncCardsSyncedBeforeUnit;
  }

  public set syncCardsSyncedBeforeUnit(value: TimespanUnit) {
    this._dtoSyncParam.syncCardsSyncedBeforeUnit = value;
  }

  public get syncCardSymbols(): boolean {
    return this._dtoSyncParam.syncCardSymbols;
  }

  public set syncCardSymbols(value: boolean) {
    this._dtoSyncParam.syncCardSymbols = value;
  }
  //#endregion

  //#region Constructor -------------------------------------------------------
  public constructor(dtoSyncParam: DtoSyncParam) {
    this._orgSyncParam = clone(dtoSyncParam);
    this._dtoSyncParam = dtoSyncParam;
  }
  //#endregion

  //#region Public methods ----------------------------------------------------

  public getCardImageStatusToSync(imageStatus: ImageStatus): boolean {
    return this._dtoSyncParam.cardImageStatusToSync.indexOf(imageStatus) >= 0;
  }

  public setCardImageStatusToSync(syncType: ImageStatus, value: boolean) {
    if (value) {
      this._dtoSyncParam.cardImageStatusToSync.push(syncType);
    } else {
      this._dtoSyncParam.cardImageStatusToSync = this._dtoSyncParam.cardImageStatusToSync
        .filter((s: ImageStatus) => s != syncType);
    }
  }

  public getCatalogToSync(catalogType: CatalogType): boolean {
    return this._dtoSyncParam.catalogTypesToSync.indexOf(catalogType) >= 0;
  }

  public setCatalogToSync(catalogType: CatalogType, value: boolean) {
    if (value) {
      this._dtoSyncParam.catalogTypesToSync.push(catalogType);
    } else {
      this._dtoSyncParam.catalogTypesToSync = this._dtoSyncParam.catalogTypesToSync
        .filter((s: CatalogType) => s != catalogType);
    }
  }
  //#endregion
}
