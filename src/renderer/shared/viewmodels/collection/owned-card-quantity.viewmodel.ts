import { IOwnedCardCollectionMapDto, IOwnedCardQuantityDto } from "../../../../common/dto";
import { CardCondition } from "../../../../common/types";
import { BaseViewmodel } from "../base.viewmodel";


export class OwnedCardQuantityViewmodel extends BaseViewmodel<IOwnedCardQuantityDto> {
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
    return this._dto.collectionMaps.reduce((prev: number, cur: IOwnedCardCollectionMapDto) => prev + cur.quantity, 0);
  }

  public set quantity(value: number) {
    this._dto.collectionMaps.forEach((m: IOwnedCardCollectionMapDto) => m.quantity = value);
  }
  //#endregion

  //#region Constructor -------------------------------------------------------
  public constructor(dto: IOwnedCardQuantityDto) {
    super(dto);
  }
  //#endregion
}
