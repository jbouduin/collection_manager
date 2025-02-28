import { CardRarity, CatalogType, GameFormat } from "../../../types";
import { CatalogItemDto } from "../master-data";

export type QueryParamToken = "sets" | "gameformats" | "rarities" | "own" | CatalogType;
export const QUERY_PARAM_LIST_SEPARATOR = "¶";
/**
 * Feature: saved searches
 */
export interface CardQueryDto {
  ownedCards: boolean;
  selectedCatalogItems: Array<CatalogItemDto>;
  selectedGameFormats: Array<GameFormat>;
  selectedRarities: Array<CardRarity>;
  selectedSets: Array<string>;
}
