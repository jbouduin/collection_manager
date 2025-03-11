import { OwnedCardDto, OwnedCardListDto } from "../../../../common/dto";
import { BaseMtgCardListViewmodel } from "../../../shared/viewmodels";

export class CollectionCardListViewmodel extends BaseMtgCardListViewmodel<OwnedCardListDto> {
  //#region Getters -----------------------------------------------------------
  public get ownedCards(): Array<OwnedCardDto> {
    return this._dtoCard.ownedCards;
  }
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(dtoCard: OwnedCardListDto) {
    super(dtoCard);
  }
  //#endregion
}
