import { Selectable } from "kysely";
import { DeckCardTable, DeckTable } from "../../../main/database/schema/deck";

export type IDeckCardDto = Selectable<DeckCardTable>;
export type IDeckDto = Selectable<DeckTable>;
export type IDeckFolderDto = IDeckDto;
