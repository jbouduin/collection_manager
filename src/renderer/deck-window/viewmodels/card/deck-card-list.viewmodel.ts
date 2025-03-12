import { IDeckCardListDto } from "../../../../common/dto";
import { BaseMtgCardListViewmodel } from "../../../shared/viewmodels";


export class DeckCardListViewmodel extends BaseMtgCardListViewmodel<IDeckCardListDto> {
  //#region Getters -----------------------------------------------------------
  public get deckCardId(): number {
    return this._dtoCard.deck_card_id;
  }
  public get deckQuantity(): number {
    return this._dtoCard.deck_quantity;
  }

  public get sideboardQuantity(): number {
    return this._dtoCard.sideboard_quantity;
  }
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(dtoCard: IDeckCardListDto) {
    super(dtoCard);
  }
  //#endregion
}
