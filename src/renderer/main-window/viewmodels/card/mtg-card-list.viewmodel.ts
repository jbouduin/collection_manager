import { MtgCardLanguageDto, MtgCardListDto } from "../../../../common/dto";
import { BaseMtgCardListViewmodel } from "../../../shared/viewmodels";

export class MtgCardListViewmodel extends BaseMtgCardListViewmodel<MtgCardListDto> {
  //#region List Specific getters ---------------------------------------------
  public get languages(): Array<MtgCardLanguageDto> {
    return this._dtoCard.languages;
  }
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(dtoCard: MtgCardListDto) {
    super(dtoCard);
  }
  //#endregion
}
