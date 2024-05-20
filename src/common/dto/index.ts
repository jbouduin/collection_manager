import { CatalogItem, Color, Language, RulingLine } from "../../main/database/schema";

export * from "./select/card-image.dto";
export * from "./select/card-set.dto";
export * from "./select/card.dto";
export * from "./select/card-symbol.dto";

export type CatalogItemDto = CatalogItem;
export type ColorDto = Color;
export type LanguageDto = Language;
export type RulingLineDto = RulingLine;
