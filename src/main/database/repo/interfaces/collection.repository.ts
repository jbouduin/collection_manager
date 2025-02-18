import { CollectionDto, OwnedCardListDto } from "../../../../common/dto";
import { IResult } from "../../../services/base";


export interface ICollectionRepository {
  getAll(): Promise<IResult<Array<CollectionDto>>>;
  getCollectionCardList(id: number): Promise<IResult<Array<OwnedCardListDto>>>;
  create(collection: CollectionDto): Promise<IResult<CollectionDto>>;
  delete(id: number): Promise<IResult<number>>;
  update(collection: CollectionDto): Promise<IResult<CollectionDto>>;
}
