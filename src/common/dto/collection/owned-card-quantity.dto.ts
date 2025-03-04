import { Selectable } from "kysely";
import { OwnedCardTable } from "../../../main/database/schema";
import { OwnedCardCollectionMapDto } from "./types";

export interface OwnedCardQuantityDto extends Selectable<OwnedCardTable> {
  collectionMaps: Array<OwnedCardCollectionMapDto>;
}
