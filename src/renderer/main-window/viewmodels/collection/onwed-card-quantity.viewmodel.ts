import { OwnedCardCollectionMapDto, OwnedCardQuantityDto } from "../../../../common/dto";
import { CardCondition } from "../../../../common/types";
import { BaseViewmodel } from "../../../common/viewmodels/base.viewmodel";

export class OwnedCardQuantityViewmodel extends BaseViewmodel<OwnedCardQuantityDto> {
  //#region Getters -----------------------------------------------------------
  public get conditionId(): CardCondition {
    return this._dto.condition_id;
  }

  public get isFoil(): boolean {
    return this._dto.is_foil;
  }
  //#endregion

  //#region Get/Set -----------------------------------------------------------
  public get quantity(): number {
    return this._dto.collectionMaps.reduce((prev: number, cur: OwnedCardCollectionMapDto) => prev + cur.quantity, 0);
  }

  public set quantity(value: number) {
    this._dto.collectionMaps.forEach((m: OwnedCardCollectionMapDto) => m.quantity = value);
  }
  //#endregion

  //#region Constructor -------------------------------------------------------
  public constructor(dto: OwnedCardQuantityDto) {
    super(dto);
  }
  //#endregion
}
