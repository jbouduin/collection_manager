import { Selectable } from "kysely";
import { CardTable } from "../../../main/database/schema";
import { IMtgCardLanguageDto } from "./mtg-card-language.dto";

export interface IMtgCardOtherPrint extends Selectable<CardTable> {
  languages: Array<IMtgCardLanguageDto>;
  released_at: Date;
}
