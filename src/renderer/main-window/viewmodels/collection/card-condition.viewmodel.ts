import { CardConditionDto } from "../../../../common/dto";
import { CardCondition } from "../../../../common/types";
import { BaseViewmodel } from "../../../common/viewmodels/base.viewmodel";


export class CardConditionViewmodel extends BaseViewmodel<CardConditionDto> {
  //#region getters -----------------------------------------------------------
  public get condition(): string {
    return this._dto.condition;
  }

  public get code(): CardCondition {
    return this._dto.id;
  }

  public get expression(): string {
    return this._dto.expression;
  }
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(condition: CardConditionDto) {
    super(condition);
  }
  //#endregion
}
