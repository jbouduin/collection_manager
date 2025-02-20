import { CollectionDto, OwnedCardListDto, OwnedCardQuantityDto } from "../../../../common/dto";
import { IResult } from "../../../services/base";


export interface ICollectionRepository {
  getAll(): Promise<IResult<Array<CollectionDto>>>;
  getCardQuantitiesForCard(cardId: string): Promise<IResult<Array<OwnedCardQuantityDto>>>;
  getCardQuantitiesForCardInCollection(cardId: string, collectionId: number | null): Promise<IResult<Array<OwnedCardQuantityDto>>>;
  getCollectionCardList(id: number): Promise<IResult<Array<OwnedCardListDto>>>;
  create(collection: CollectionDto): Promise<IResult<CollectionDto>>;
  delete(id: number): Promise<IResult<number>>;
  update(collection: CollectionDto): Promise<IResult<CollectionDto>>;
}
