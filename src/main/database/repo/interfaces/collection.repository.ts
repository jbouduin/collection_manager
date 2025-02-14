import { DeleteResult } from "kysely";
import { CollectionDto, NewCollection, UpdateCollection } from "../../../../common/dto";
import { IResult } from "../../../services/base";


export interface ICollectionRepository {
  getAll(): Promise<IResult<Array<CollectionDto>>>;
  create(collection: NewCollection): Promise<CollectionDto>;
  delete(id: number): Promise<DeleteResult>;
  update(collection: UpdateCollection): Promise<CollectionDto>;
}
