import { CollectionDto, OwnedCardListDto, OwnedCardQuantityDto } from "../../../../common/dto";
import { IResult } from "../../../services/base";


export interface ICollectionRepository {
  getAll(): Promise<IResult<Array<CollectionDto>>>;
  getCardQuantitiesForCard(cardId: string): Promise<IResult<Array<OwnedCardQuantityDto>>>;
  getCardQuantitiesForCardInCollection(cardId: string, collectionId: number): Promise<IResult<Array<OwnedCardQuantityDto>>>;
  getCollectionCardList(id: number): Promise<IResult<Array<OwnedCardListDto>>>;
  create(collection: CollectionDto): Promise<IResult<CollectionDto>>;
  delete(id: number): Promise<IResult<number>>;
  saveQuantitiesForCardInCollection(cardId: string, collectionId: number, quantities: Array<OwnedCardQuantityDto>): Promise<IResult<Array<OwnedCardQuantityDto>>>;
  update(collection: CollectionDto): Promise<IResult<CollectionDto>>;
}
