import { CardRarity, CatalogType, MtgGameFormat, MtgColor } from "../../types";
import { ICatalogItemDto } from "../master-data";

export type CardQueryParamToken =
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
export interface ICardQueryDto {
  ownedCards: boolean;
  selectedCardColors: Array<MtgColor>;
  selectedCatalogItems: Array<ICatalogItemDto>;
  selectedIdentityColors: Array<MtgColor>;
  selectedGameFormats: Array<MtgGameFormat>;
  selectedProducedManaColors: Array<MtgColor>;
  selectedRarities: Array<CardRarity>;
  selectedSets: Array<string>;
}
