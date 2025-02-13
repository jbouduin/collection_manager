
import { container } from "tsyringe";
import { SCRYFALL } from "../../service.tokens";
import { CardCardMapAdapter } from "./implementation/card-card-map.adapter";
import { CardColorMapAdapter } from "./implementation/card-color-map.adapter";
import { CardGameAdapter } from "./implementation/card-game.adapter";
import { CardMultiverseIdAdapter } from "./implementation/card-multiverse-id.adapter";
import { CardSetAdapter } from "./implementation/card-set.adapter";
import { CardSymbolAlternativeAdapter } from "./implementation/card-symbol-alternative.adapter";
import { CardSymbolColorMapAdapter } from "./implementation/card-symbol-color-map.adapter";
import { CardSymbolAdapter } from "./implementation/card-symbol.adapter";
import { CardAdapter } from "./implementation/card.adapter";
import { CardfaceColorMapAdapter } from "./implementation/cardface-color-map.adapter";
import { CardfaceAdapter } from "./implementation/cardface.adapter";
import { CatalogAdapter } from "./implementation/catalog.adapter";
import { OracleKeywordAdapter } from "./implementation/oracle-keyword.adapter";
import { OracleLegalityAdapter } from "./implementation/oracle-legality.adapter";
import { OracleRulingLineAdapter } from "./implementation/oracle-ruling-line.adapter";
import { OracleRulingAdapter } from "./implementation/oracle-ruling.adapter";
import { OracleAdapter } from "./implementation/oracle.adapter";
import {
  ICardAdapter, ICardCardMapAdapter, ICardColorMapAdapter, ICardGameAdapter, ICardMultiverseIdAdapter,
  ICardSetAdapter,
  ICardSymbolAdapter, ICardSymbolAlternativeAdapter, ICardSymbolColorMapAdapter,
  ICardfaceAdapter, ICardfaceColorMapAdapter, ICatalogAdapter,
  IOracleAdapter, IOracleKeywordAdapter,
  IOracleLegalityAdapter,
  IOracleRulingAdapter, IOracleRulingLineAdapter
} from "./interface";


export class AdaptDi {
  public static registerAdapters() {
    container.register<ICardCardMapAdapter>(SCRYFALL.CardCardMapAdapter, { useClass: CardCardMapAdapter });
    container.register<ICardGameAdapter>(SCRYFALL.CardGameAdapter, { useClass: CardGameAdapter });
    container.register<ICardMultiverseIdAdapter>(SCRYFALL.CardMultiverseIdAdapter, { useClass: CardMultiverseIdAdapter });
    container.register<ICardSetAdapter>(SCRYFALL.CardSetAdapter, { useClass: CardSetAdapter });
    container.register<ICardAdapter>(SCRYFALL.CardAdapter, { useClass: CardAdapter });
    container.register<ICardColorMapAdapter>(SCRYFALL.CardColorMapAdapter, { useClass: CardColorMapAdapter });
    container.register<ICardfaceAdapter>(SCRYFALL.CardfaceAdapter, { useClass: CardfaceAdapter });
    container.register<ICardfaceColorMapAdapter>(SCRYFALL.CardfaceColorMapAdapter, { useClass: CardfaceColorMapAdapter });
    container.register<ICatalogAdapter>(SCRYFALL.CatalogAdapter, { useClass: CatalogAdapter });
    container.register<ICardSymbolAlternativeAdapter>(SCRYFALL.CardSymbolAlternativeAdapter, { useClass: CardSymbolAlternativeAdapter });
    container.register<ICardSymbolColorMapAdapter>(SCRYFALL.CardSymbolColorMapAdapter, { useClass: CardSymbolColorMapAdapter });
    container.register<ICardSymbolAdapter>(SCRYFALL.CardSymbolAdapter, { useClass: CardSymbolAdapter });
    container.register<IOracleAdapter>(SCRYFALL.OracleAdapter, { useClass: OracleAdapter });
    container.register<IOracleKeywordAdapter>(SCRYFALL.OracleKeywordAdapter, { useClass: OracleKeywordAdapter });
    container.register<IOracleRulingLineAdapter>(SCRYFALL.OracleRulingLineAdapter, { useClass: OracleRulingLineAdapter });
    container.register<IOracleRulingAdapter>(SCRYFALL.OracleRulingAdapter, { useClass: OracleRulingAdapter });
    container.register<IOracleLegalityAdapter>(SCRYFALL.OracleLegalityAdapter, { useClass: OracleLegalityAdapter });
  }
}
