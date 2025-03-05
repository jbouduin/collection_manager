import { DeckFolderDto, DeckListDto } from "../../../../common/dto";
import { IResult } from "../../../services/base";


export interface IDeckRepository {
  createDeck(deck: DeckListDto): Promise<IResult<DeckListDto>>;
  deleteDeck(id: number): Promise<IResult<number>>;
  getAllDecksInFolder(folderId: number): Promise<IResult<Array<DeckListDto>>>;
  getAllFolders(): Promise<IResult<Array<DeckFolderDto>>>;
  patchDeck(deck: Partial<DeckListDto>): Promise<IResult<DeckListDto>>;
}
