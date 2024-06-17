import { DeleteResult } from "kysely";
import { DtoCollection, NewCollection, UpdateCollection } from "../../../../common/dto";

export interface ICollectionRepository {
  getAll(): Promise<Array<DtoCollection>>;
  create(collection: NewCollection): Promise<DtoCollection>;
  delete(id: number): Promise<DeleteResult>;
  update(collection: UpdateCollection): Promise<DtoCollection>;
}
