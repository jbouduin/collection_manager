import { ICollectionDto } from "../../../../common/dto";
import { IBaseTreeNodeViewmodel } from "../../../shared/components/base";
import { CollectionViewmodel } from "./collection.viewmodel";

export class CollectionTreeViewmodel extends CollectionViewmodel implements IBaseTreeNodeViewmodel {
  //#region Pbulic fields -----------------------------------------------------
  public isSelected: boolean;
  public isExpanded: boolean;
  //#endregion

  //#region Constructor -------------------------------------------------------
  public constructor(dto: ICollectionDto, isSelected: boolean, isExpanded: boolean) {
    super(dto);
    this.isSelected = isSelected;
    this.isExpanded = isExpanded;
  }
  //#endregion
}
