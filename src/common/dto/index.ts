import { Card, CardSet, CatalogItem, Color, Language, RulingLine } from "../../main/database/schema";

export * from "./select/symbology.select.dto";

export type CardSelectDto = Card;
export type CardSetSelectDto = CardSet;
export type CatalogItemSelectDto = CatalogItem;
export type ColorSelectDto = Color;
export type LanguageSelectDto = Language;
export type RulingsByCardIdSelectDto = Array<RulingLine>;
