import { CardRarity, CatalogType, MtgGameFormat, MtgColor } from "../../types";
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
  selectedCardColors: Array<MtgColor>;
  selectedCatalogItems: Array<CatalogItemDto>;
  selectedIdentityColors: Array<MtgColor>;
  selectedGameFormats: Array<MtgGameFormat>;
  selectedProducedManaColors: Array<MtgColor>;
  selectedRarities: Array<CardRarity>;
  selectedSets: Array<string>;
}
