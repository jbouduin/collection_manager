import { Selectable } from "kysely";
import { CardConditionTable, CollectionTable, OwnedCardCollectionMapTable } from "../../../main/database/schema";


export type ICardConditionDto = Selectable<CardConditionTable>;
export type ICollectionDto = Selectable<CollectionTable>;
export type IOwnedCardCollectionMapDto = Selectable<OwnedCardCollectionMapTable>;
