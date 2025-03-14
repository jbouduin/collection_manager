import { ScryfallUniqueStrategy } from "./scryfall-unique-strategy";

export interface IScryfallSearchOptionsDto {
  unique: ScryfallUniqueStrategy;
  include_extras?: boolean;
  include_multilingual?: boolean;
  include_variations?: boolean;
}
