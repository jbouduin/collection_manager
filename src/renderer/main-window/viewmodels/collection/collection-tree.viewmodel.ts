import { CollectionDto } from "../../../../common/dto";
import { BaseTreeNodeViewmodel } from "../../components/common/base-tree-view";
import { CollectionViewmodel } from "./collection.viewmodel";

export class CollectionTreeViewmodel extends CollectionViewmodel implements BaseTreeNodeViewmodel {
  //#region Pbulic fields -----------------------------------------------------
  public isSelected: boolean;
  public isExpanded: boolean;
  //#endregion

  //#region Constructor -------------------------------------------------------
  public constructor(dto: CollectionDto, isSelected: boolean, isExpanded: boolean) {
    super(dto);
    this.isSelected = isSelected;
    this.isExpanded = isExpanded;
  }
  //#endregion
}
