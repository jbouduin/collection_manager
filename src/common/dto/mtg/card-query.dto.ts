import { CardRarity, CatalogType, GameFormat, MTGColor } from "../../types";
import { CatalogItemDto } from "../master-data";

export type QueryParamToken =
  "set" |
  "format" |
  "rarity" |
  "own" |
  "ic" | // identity color
  "cc" | // card color
  "pm" | // produced mana color
  CatalogType;

export const QUERY_PARAM_LIST_SEPARATOR = "¶";
/**
 * Feature: saved searches
 */
export interface CardQueryDto {
  ownedCards: boolean;
  selectedCardColors: Array<MTGColor>;
  selectedCatalogItems: Array<CatalogItemDto>;
  selectedIdentityColors: Array<MTGColor>;
  selectedGameFormats: Array<GameFormat>;
  selectedProducedManaColors: Array<MTGColor>;
  selectedRarities: Array<CardRarity>;
  selectedSets: Array<string>;
}
