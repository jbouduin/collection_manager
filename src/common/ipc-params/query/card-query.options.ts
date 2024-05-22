import { MTGLanguage } from "../../../common/enums";

export interface CardQueryOptions {
  cardId?: string;
  setIds?: Array<string>;
  languages?: Array<MTGLanguage>;
}
