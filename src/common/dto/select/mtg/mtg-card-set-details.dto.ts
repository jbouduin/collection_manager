import { Selectable } from "kysely";
import { CardSetTable } from "../../../../main/database/schema";
import { MtgCardSetLanguageDto } from "./mtg-card-set-language.dto";

export interface MtgCardSetDetailsDto extends Selectable<CardSetTable> {
  languages: Array<MtgCardSetLanguageDto>;
  unique_cards: number;
}
