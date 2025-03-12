import { IMtgCardLanguageDto, IMtgCardListDto } from "../../../../common/dto";
import { BaseMtgCardListViewmodel } from "../../../shared/viewmodels";

export class MtgCardListViewmodel extends BaseMtgCardListViewmodel<IMtgCardListDto> {
  //#region List Specific getters ---------------------------------------------
  public get languages(): Array<IMtgCardLanguageDto> {
    return this._dtoCard.languages;
  }
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(dtoCard: IMtgCardListDto) {
    super(dtoCard);
  }
  //#endregion
}
