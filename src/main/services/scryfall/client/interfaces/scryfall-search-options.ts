import { ScryfallUniqueStrategy } from "./scryfall-unique-strategy";

export interface ScryfallSearchOptions {
  unique: ScryfallUniqueStrategy;
  include_extras?: boolean;
  include_multilingual?: boolean;
  include_variations?: boolean;
}
