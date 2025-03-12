import { Selectable } from "kysely";
import { OwnedCardTable } from "../../../main/database/schema";
import { IOwnedCardCollectionMapDto } from "./types";

export interface IOwnedCardQuantityDto extends Selectable<OwnedCardTable> {
  collectionMaps: Array<IOwnedCardCollectionMapDto>;
}
