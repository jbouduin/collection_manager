import { IOwnedCardDto, IOwnedCardListDto } from "../../../../common/dto";
import { BaseMtgCardListViewmodel } from "../../../shared/viewmodels";

export class CollectionCardListViewmodel extends BaseMtgCardListViewmodel<IOwnedCardListDto> {
  //#region Getters -----------------------------------------------------------
  public get ownedCards(): Array<IOwnedCardDto> {
    return this._dtoCard.ownedCards;
  }
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(dtoCard: IOwnedCardListDto) {
    super(dtoCard);
  }
  //#endregion
}
