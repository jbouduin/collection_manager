import { CatalogItem, Color, Language, RulingLine } from "../../main/database/schema";

export * from "./select/card-image-select.dto";
export * from "./select/card-set.select.dto";
export * from "./select/card.select.dto";
export * from "./select/symbology.select.dto";

export type CatalogItemSelectDto = CatalogItem;
export type ColorSelectDto = Color;
export type LanguageSelectDto = Language;
export type RulingLineDto = RulingLine;
export type RulingsByCardIdSelectDto = Array<RulingLineDto>;
