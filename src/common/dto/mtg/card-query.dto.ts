import { CardRarity, MtgGameFormat, MtgColor } from "../../types";
import { ICatalogItemDto } from "../master-data";

export const QUERY_PARAM_LIST_SEPARATOR = "¶";
/**
 * FEATURE: saved searches
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
