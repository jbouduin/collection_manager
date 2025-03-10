import { DeckCardListDto, DeckDetailsDto, DeckDto, DeckFolderDto, DeckListDto } from "../../../../common/dto";
import { IResult } from "../../../services/base";


export interface IDeckRepository {
  createDeck(deck: DeckDto): Promise<IResult<DeckDto>>;
  deleteDeck(id: number): Promise<IResult<number>>;
  getAllCardsOfDeck(deckId: number): Promise<IResult<Array<DeckCardListDto>>>;
  getAllDecksInFolder(folderId: number): Promise<IResult<Array<DeckListDto>>>;
  getAllFolders(): Promise<IResult<Array<DeckFolderDto>>>;
  getDeckDetails(id: number): Promise<IResult<DeckDetailsDto>>;
  patchDeck(deck: Partial<DeckDto>): Promise<IResult<DeckDto>>;
}
