import { Selectable } from "kysely";

import { CardSetTable } from "../../../main/database/schema";
import { DtoCardSetLanguage } from "./card-set-language.dto";

export interface DtoCardSetDetails extends Selectable<CardSetTable> {
  languages: Array<DtoCardSetLanguage>;
  unique_cards: number;
}
