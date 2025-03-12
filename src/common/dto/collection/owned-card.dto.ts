import { Selectable } from "kysely";
import { OwnedCardTable } from "../../../main/database/schema";


export interface IOwnedCardDto extends Selectable<OwnedCardTable> {
  quantity: number;
}
