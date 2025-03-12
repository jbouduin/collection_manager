import { ICollectionDto } from "../../../../common/dto";
import { BaseViewmodel } from "../../../shared/viewmodels";


export class CollectionViewmodel extends BaseViewmodel<ICollectionDto> {
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

  public constructor(dto: ICollectionDto) {
    super(dto);
  }
}
