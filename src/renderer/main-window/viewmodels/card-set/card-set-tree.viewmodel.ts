import { MtgCardSetDto } from "../../../../common/dto";
import { BaseTreeNodeViewmodel } from "../../components/common/base-tree-view";
import { CardSetViewmodel } from "./card-set.viewmodel";


export class CardSetTreeViewmodel extends CardSetViewmodel implements BaseTreeNodeViewmodel {
  //#region Pbulic fields -----------------------------------------------------
  public isSelected: boolean;
  public isExpanded: boolean;
  //#endregion

  //#region Constructor -------------------------------------------------------
  public constructor(dto: MtgCardSetDto, isSelected: boolean, isExpanded: boolean) {
    super(dto);
    this.isSelected = isSelected;
    this.isExpanded = isExpanded;
  }
  //#endregion
}
