import { CatalogItem, Color, Language } from "../../main/database/schema";

export * from "./select/symbology-select.dto";

export type LanguageSelectDto = Language;
export type CatalogItemSelectDto = CatalogItem;
export type ColorSelectDto = Color;
