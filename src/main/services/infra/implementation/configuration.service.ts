import * as fs from "fs";
import * as path from "path";

import { CatalogType } from "../../../../common/enums";
import { ScryfallEndpoint } from "../../scryfall";
import { IConfigurationService } from "../interfaces";
import { SyncType } from "../../../../common/ipc-params";

// FEATURE configuration
// cleanup the getters, they should not call fs methods
export class ConfigurationService implements IConfigurationService {

  public get dataDirectory(): string {
    const result = "C:/data/new-assistant";
    if (!fs.existsSync(result)) {
      fs.mkdirSync(result, { recursive: true });
    }
    return result;
  }

  public get dataBaseName(): string {
    return path.join(this.dataDirectory, "database", "magic-db.sqlite");
  }

  public get cacheDirectory(): string {
    const result = path.join(this.dataDirectory, ".cache");
    if (!fs.existsSync(result)) {
      console.log(`creating ${result}`);
      fs.mkdirSync(result, { recursive: true });
    }
    return result;
  }

  public get isNewInstallation(): boolean {
    return !fs.existsSync(this.dataBaseName);
  }

  public get scryfallApiRoot(): string {
    return "https://api.scryfall.com";
  }

  public get scryfallEndpoints(): Map<ScryfallEndpoint, string> {
    const result = new Map<ScryfallEndpoint, string>();
    result.set("card", "cards/search");
    result.set("cardSet", "sets");
    result.set("cardSymbol", "symbology");
    result.set("catalog", "catalog");
    result.set("ruling", "cards/:id/rulings");
    result.set("collection", "cards/collection")
    return result;
  }

  public get scryfallCatalogPaths(): Map<CatalogType, string> {
    const result = new Map<CatalogType, string>();
    result.set("AbilityWords", "ability-words");
    result.set("ArtifactTypes", "artifact-types");
    result.set("ArtistNames", "artist-names");
    result.set("CardNames", "card-names");
    result.set("CreatureTypes", "creature-types");
    result.set("EnchantmentTypes", "enchantment-types");
    result.set("KeywordAbilities", "keyword-abilities");
    result.set("KeywordActions", "keyword-actions");
    result.set("LandTypes", "land-types");
    result.set("Loyalties", "loyalties");
    result.set("PlaneswalkerTypes", "planeswalker-types");
    result.set("Powers", "powers");
    result.set("SpellTypes", "spell-types");
    result.set("Supertypes", "super-types");
    result.set("Toughnesses", "toughnesses");
    result.set("Watermarks", "watermarks");
    result.set("WordBank", "word-bank");
    return result;
  }

  public get syncAtStartup(): Array<SyncType> {
    return new Array<SyncType>();
  }
}
