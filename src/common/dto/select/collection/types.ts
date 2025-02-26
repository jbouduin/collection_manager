import { Selectable } from "kysely";
import { CardConditionTable, CollectionTable, OwnedCardCollectionMapTable } from "../../../../main/database/schema";


export type CardConditionDto = Selectable<CardConditionTable>;
export type CollectionDto = Selectable<CollectionTable>;
export type OwnedCardCollectionMapDto = Selectable<OwnedCardCollectionMapTable>;
