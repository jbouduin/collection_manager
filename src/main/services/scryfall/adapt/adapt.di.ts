
import { container } from "tsyringe";

import { CardCardMapAdapter } from "./implementation/card-card-map.adapter";
import { CardColorMapAdapter } from "./implementation/card-color-map.adapter";
import { CardGameAdapter } from "./implementation/card-game.adapter";
import { CardImageAdapter } from "./implementation/card-image.adapter";
import { CardMultiverseIdAdapter } from "./implementation/card-multiverse-id.adapter";
import { CardSetAdapter } from "./implementation/card-set.adapter";
import { CardAdapter } from "./implementation/card.adapter";
import { CardfaceColorMapAdapter } from "./implementation/cardface-color-map.adapter";
import { CardFaceImageAdapter } from "./implementation/cardface-image.adapter";
import { CardfaceAdapter } from "./implementation/cardface.adapter";
import { CatalogAdapter } from "./implementation/catalog.adapter";
import { OracleRulingLineAdapter } from "./implementation/oracle-ruling-line.adapter";
import { OracleRulingAdapter } from "./implementation/oracle-ruling.adapter";
import { CardSymbolAlternativeAdapter } from "./implementation/card-symbol-alternative.adapter";
import { CardSymbolColorMapAdapter } from "./implementation/card-symbol-color-map.adapter";
import { CardSymbolAdapter } from "./implementation/card-symbol.adapter";
import ADAPTTOKENS, {
  ICardAdapter, ICardCardMapAdapter, ICardColorMapAdapter, ICardGameAdapter, ICardImageAdapter, ICardMultiverseIdAdapter,
  ICardSetAdapter, ICardfaceAdapter, ICardfaceColorMapAdapter, ICardfaceImageAdapter,  ICatalogAdapter,
  ICardSymbolAdapter, ICardSymbolAlternativeAdapter, ICardSymbolColorMapAdapter,
  IOracleAdapter, IOracleKeywordAdapter, IOracleRulingAdapter, IOracleRulingLineAdapter,  IOracleLegalityAdapter,
} from "./interface";
import { OracleAdapter } from "./implementation/oracle.adapter";
import { OracleKeywordAdapter } from "./implementation/oracle-keyword.adapter";
import { OracleLegalityAdapter } from "./implementation/oracle-legality.adapter";

export class AdaptDi {

  public static registerAdapters() {
    container.register<ICardCardMapAdapter>(ADAPTTOKENS.CardCardMapAdapter, { useClass: CardCardMapAdapter });
    container.register<ICardColorMapAdapter>(ADAPTTOKENS.CardColorMapAdapter, { useClass: CardColorMapAdapter });
    container.register<ICardGameAdapter>(ADAPTTOKENS.CardGameAdapter, { useClass: CardGameAdapter });
    container.register<ICardImageAdapter>(ADAPTTOKENS.CardImageAdapter, { useClass: CardImageAdapter });
    container.register<ICardMultiverseIdAdapter>(ADAPTTOKENS.CardMultiverseIdAdapter, { useClass: CardMultiverseIdAdapter });
    container.register<ICardSetAdapter>(ADAPTTOKENS.CardSetAdapter, { useClass: CardSetAdapter });
    container.register<ICardAdapter>(ADAPTTOKENS.CardAdapter, { useClass: CardAdapter });
    container.register<ICardfaceAdapter>(ADAPTTOKENS.CardfaceAdapter, { useClass: CardfaceAdapter });
    container.register<ICardfaceColorMapAdapter>(ADAPTTOKENS.CardfaceColorMapAdapter, { useClass: CardfaceColorMapAdapter });
    container.register<ICardfaceImageAdapter>(ADAPTTOKENS.CardfaceImageAdapter, { useClass: CardFaceImageAdapter });
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
