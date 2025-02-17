import { CollectionDto } from "../../../../common/dto";
import { BaseViewmodel } from "../../../common/viewmodels/base.viewmodel";


export class CollectionViewmodel extends BaseViewmodel<CollectionDto> {
  public get id(): number {
    return this._dto.id;
  }

  public get name(): string {
    return this._dto.name;
  }

  public set name(value: string) {
    this._dto.name = value;
  }

  public get description(): string {
    return this._dto.description;
  }

  public set description(value: string) {
    this._dto.description = value;
  }

  public get parentId(): number {
    return this._dto.parent_id;
  }

  public get isFolder(): boolean {
    return this._dto.is_folder;
  }

  public get isSystem(): boolean {
    return this._dto.is_system;
  }

  public get createdAtString(): string {
    return this._dto.created_at ? this._dto.created_at.toLocaleDateString() : undefined;
  }

  public get modifiedAtString(): string {
    return this._dto.modified_at ? this._dto.modified_at.toLocaleDateString() : undefined;
  }

  public constructor(dto: CollectionDto) {
    super(dto);
  }
}

export class CollectionTreeViewmodel extends CollectionViewmodel {
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
