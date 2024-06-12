
import { container } from "tsyringe";

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
import ADAPTTOKENS, {
  ICardAdapter, ICardCardMapAdapter, ICardColorMapAdapter, ICardGameAdapter, ICardMultiverseIdAdapter,
  ICardSetAdapter,
  ICardSymbolAdapter, ICardSymbolAlternativeAdapter, ICardSymbolColorMapAdapter,
  ICardfaceAdapter, ICardfaceColorMapAdapter, ICatalogAdapter,
  IOracleAdapter, IOracleKeywordAdapter,
  IOracleLegalityAdapter,
  IOracleRulingAdapter, IOracleRulingLineAdapter,
} from "./interface";


export class AdaptDi {

  public static registerAdapters() {
    container.register<ICardCardMapAdapter>(ADAPTTOKENS.CardCardMapAdapter, { useClass: CardCardMapAdapter });
    container.register<ICardGameAdapter>(ADAPTTOKENS.CardGameAdapter, { useClass: CardGameAdapter });
    container.register<ICardMultiverseIdAdapter>(ADAPTTOKENS.CardMultiverseIdAdapter, { useClass: CardMultiverseIdAdapter });
    container.register<ICardSetAdapter>(ADAPTTOKENS.CardSetAdapter, { useClass: CardSetAdapter });
    container.register<ICardAdapter>(ADAPTTOKENS.CardAdapter, { useClass: CardAdapter });
    container.register<ICardColorMapAdapter>(ADAPTTOKENS.CardColorMapAdapter, { useClass: CardColorMapAdapter });
    container.register<ICardfaceAdapter>(ADAPTTOKENS.CardfaceAdapter, { useClass: CardfaceAdapter });
    container.register<ICardfaceColorMapAdapter>(ADAPTTOKENS.CardfaceColorMapAdapter, { useClass: CardfaceColorMapAdapter });
    container.register<ICatalogAdapter>(ADAPTTOKENS.CatalogAdapter, { useClass: CatalogAdapter });
    container.register<ICardSymbolAlternativeAdapter>(ADAPTTOKENS.CardSymbolAlternativeAdapter, { useClass: CardSymbolAlternativeAdapter });
    container.register<ICardSymbolColorMapAdapter>(ADAPTTOKENS.CardSymbolColorMapAdapter, { useClass: CardSymbolColorMapAdapter });
    container.register<ICardSymbolAdapter>(ADAPTTOKENS.CardSymbolAdapter, { useClass: CardSymbolAdapter });
    container.register<IOracleAdapter>(ADAPTTOKENS.OracleAdapter, { useClass: OracleAdapter });
    container.register<IOracleKeywordAdapter>(ADAPTTOKENS.OracleKeywordAdapter, { useClass: OracleKeywordAdapter });
    container.register<IOracleRulingLineAdapter>(ADAPTTOKENS.OracleRulingLineAdapter, { useClass: OracleRulingLineAdapter });
    container.register<IOracleRulingAdapter>(ADAPTTOKENS.OracleRulingAdapter, { useClass: OracleRulingAdapter });
    container.register<IOracleLegalityAdapter>(ADAPTTOKENS.OracleLegalityAdapter, { useClass: OracleLegalityAdapter });
  }
}
