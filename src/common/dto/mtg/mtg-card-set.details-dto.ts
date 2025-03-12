import { Selectable } from "kysely";
import { CardSetTable } from "../../../main/database/schema";
import { IMtgCardSetLanguageDto } from "./mtg-card-set-language.dto";

export interface IMtgCardSetDetailDto extends Selectable<CardSetTable> {
  languages: Array<IMtgCardSetLanguageDto>;
  unique_cards: number;
}
