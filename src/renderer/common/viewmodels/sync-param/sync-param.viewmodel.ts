import { CardSyncType, DtoSyncParam, RulingSyncType, TimespanUnit } from "../../../../common/dto";
import { CatalogType, ImageStatus } from "../../../../common/enums";
import { BaseViewmodel } from "../base.viewmodel";


export class SyncParamViewmodel extends BaseViewmodel<DtoSyncParam> {

  //#region Getters/Setters ---------------------------------------------------
  public get cardSyncType(): CardSyncType {
    return this._dto.cardSyncType;
  }

  public set cardSyncType(value: CardSyncType) {
    this._dto.cardSyncType = value;
  }

  public get rulingSyncType(): RulingSyncType {
    return this._dto.rulingSyncType;
  }

  public set rulingSyncType(value: RulingSyncType) {
    this._dto.rulingSyncType = value;
  }

  public get syncCardSets(): boolean {
    return this._dto.syncCardSets;
  }

  public set syncCardSets(value: boolean) {
    this._dto.syncCardSets = value;
  }

  public get syncCardsSyncedBeforeNumber(): number {
    return this._dto.syncCardsSyncedBeforeNumber;
  }

  public set syncCardsSyncedBeforeNumber(value: number) {
    this._dto.syncCardsSyncedBeforeNumber = value;
  }

  public get syncCardsSyncedBeforeUnit(): TimespanUnit {
    return this._dto.syncCardsSyncedBeforeUnit;
  }

  public set syncCardsSyncedBeforeUnit(value: TimespanUnit) {
    this._dto.syncCardsSyncedBeforeUnit = value;
  }

  public get syncCardSymbols(): boolean {
    return this._dto.syncCardSymbols;
  }

  public set syncCardSymbols(value: boolean) {
    this._dto.syncCardSymbols = value;
  }
  //#endregion

  //#region Constructor -------------------------------------------------------
  public constructor(dtoSyncParam: DtoSyncParam) {
    super(dtoSyncParam);
  }
  //#endregion

  //#region Public methods ----------------------------------------------------
  public getCardImageStatusToSync(imageStatus: ImageStatus): boolean {
    return this._dto.cardImageStatusToSync.indexOf(imageStatus) >= 0;
  }

  public setCardImageStatusToSync(imageStatus: ImageStatus, value: boolean) {
    if (value) {
      this._dto.cardImageStatusToSync.push(imageStatus);
    } else {
      this._dto.cardImageStatusToSync = this._dto.cardImageStatusToSync
        .filter((s: ImageStatus) => s != imageStatus);
    }
  }

  public getCatalogToSync(catalogType: CatalogType): boolean {
    return this._dto.catalogTypesToSync.indexOf(catalogType) >= 0;
  }

  public setCatalogToSync(catalogType: CatalogType, value: boolean) {
    if (value) {
      this._dto.catalogTypesToSync.push(catalogType);
    } else {
      this._dto.catalogTypesToSync = this._dto.catalogTypesToSync
        .filter((s: CatalogType) => s != catalogType);
    }
  }
  //#endregion
}
