import { DtoCollection } from "../../../../common/dto";
import { BaseViewmodel } from "../../../common/viewmodels/base.viewmodel";

export class CollectionViewmodel extends BaseViewmodel<DtoCollection> {

  public get id(): number {
    return this._dto.id;
  }

  public get name(): string {
    return this._dto.name;
  }
  public get parentId(): number {
    return this._dto.parent_id;
  }

  public constructor(dto: DtoCollection) {
    super(dto);
  }
}
