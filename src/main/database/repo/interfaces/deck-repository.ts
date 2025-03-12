import { IDeckCardListDto, IDeckDetailsDto, IDeckDto, IDeckFolderDto, IDeckListDto, IUpdateDeckCardQuantityDto } from "../../../../common/dto";
import { IResult } from "../../../services/base";


export interface IDeckRepository {
  createDeck(deck: IDeckDto): Promise<IResult<IDeckDto>>;
  deleteDeck(id: number): Promise<IResult<number>>;
  deleteDeckCard(id: number): Promise<IResult<number>>;
  getAllCardsOfDeck(deckId: number): Promise<IResult<Array<IDeckCardListDto>>>;
  getAllDecksInFolder(folderId: number): Promise<IResult<Array<IDeckListDto>>>;
  getAllFolders(): Promise<IResult<Array<IDeckFolderDto>>>;
  getDeckDetails(id: number): Promise<IResult<IDeckDetailsDto>>;
  patchDeck(deck: Partial<IDeckDto>): Promise<IResult<IDeckDto>>;
  updateDeckCardQuantity(deckCard: IUpdateDeckCardQuantityDto): Promise<IResult<IDeckCardListDto>>;
}
