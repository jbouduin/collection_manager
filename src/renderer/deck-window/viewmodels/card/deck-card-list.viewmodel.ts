import { DeckCardListDto } from "../../../../common/dto";
import { BaseMtgCardListViewmodel } from "../../../shared/viewmodels";


export class DeckCardListViewmodel extends BaseMtgCardListViewmodel<DeckCardListDto> {
  //#region Getters -----------------------------------------------------------
  public get deckQuantity(): number {
    return this._dtoCard.deck_quantity;
  }

  public get sideboardQuantity(): number {
    return this._dtoCard.sideboard_quantity;
  }
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(dtoCard: DeckCardListDto) {
    super(dtoCard);
  }
  //#endregion
}
