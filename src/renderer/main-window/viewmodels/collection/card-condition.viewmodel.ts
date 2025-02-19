import { CardConditionDto } from "../../../../common/dto";
import { BaseViewmodel } from "../../../common/viewmodels/base.viewmodel";


export class CardConditionViewmodel extends BaseViewmodel<CardConditionDto> {
  public constructor(condition: CardConditionDto) {
    super(condition);
  }
}
