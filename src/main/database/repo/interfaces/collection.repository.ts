import { CollectionDto } from "../../../../common/dto";
import { IResult } from "../../../services/base";


export interface ICollectionRepository {
  getAll(): Promise<IResult<Array<CollectionDto>>>;
  create(collection: CollectionDto): Promise<IResult<CollectionDto>>;
  delete(id: number): Promise<IResult<number>>;
  update(collection: CollectionDto): Promise<IResult<CollectionDto>>;
}
