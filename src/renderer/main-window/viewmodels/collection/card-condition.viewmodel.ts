import { CardConditionDto } from "../../../../common/dto";
import { CardCondition } from "../../../../common/types";
import { BaseViewmodel } from "../../../shared/viewmodels";


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

  public get id(): CardCondition {
    return this._dto.id;
  }

  public get sequence(): number {
    return this._dto.sequence;
  }
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(condition: CardConditionDto) {
    super(condition);
  }
  //#endregion
}
