import { IMtgCardSetDto } from "../../../../common/dto";
import { CardSetType } from "../../../../common/types";
import { IBaseTreeNodeViewmodel } from "../../../shared/components/base/base-tree-view";


export class CardSetTreeViewmodel implements IBaseTreeNodeViewmodel {
  //#region private fields ----------------------------------------------------
  private _dto: IMtgCardSetDto;

  //#region Pbulic fields -----------------------------------------------------
  public isSelected: boolean;
  public isExpanded: boolean;
  //#endregion

  //#region Getters/Setters ---------------------------------------------------
  public get id(): string {
    return this._dto.id;
  }

  public get setCode(): string {
    return this._dto.code;
  }

  public get cardSetName(): string {
    return this._dto.name;
  }

  public get parentSetCode(): string {
    return this._dto.parent_set_code;
  }

  public get treeItemLabel(): string {
    return `${this._dto.name} (${this._dto.card_count})`;
  }

  public get cardSetType(): CardSetType {
    return this._dto.set_type;
  }

  public get releaseDateIsoString(): string {
    return new Date(this._dto.released_at).toISOString();
  }

  public get block(): string {
    return this._dto.block;
  }

  public get cardSetSvg(): string {
    return this._dto.svg;
  }
  //#endregion

  //#region Constructor -------------------------------------------------------
  public constructor(dto: IMtgCardSetDto, isSelected: boolean, isExpanded: boolean) {
    // super(dto);
    this._dto = dto;
    this.isSelected = isSelected;
    this.isExpanded = isExpanded;
  }
  //#endregion
}
