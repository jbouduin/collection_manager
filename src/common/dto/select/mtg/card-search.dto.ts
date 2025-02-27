import { CardRarity, GameFormat } from "../../../types";
import { CatalogItemDto } from "../master-data";

/**
 * Feature: saved searches
 */
export interface CardSearchDto {
  ownedCards: boolean;
  selectedCatalogItems: Array<CatalogItemDto>;
  selectedGameFormats: Array<GameFormat>;
  selectedRarities: Array<CardRarity>;
  selectedSets: Array<string>;
}
