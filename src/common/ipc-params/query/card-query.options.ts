import { MTGLanguage } from "../../../common/types";

export interface CardQueryOptions {
  cardId?: string;
  setIds?: Array<string>;
  languages?: Array<MTGLanguage>;
}
