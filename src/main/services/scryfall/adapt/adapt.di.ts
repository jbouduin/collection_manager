
import { container } from "tsyringe";

import { CardCardMapAdapter } from "./implementation/card-card-map.adapter";
import { CardColorMapAdapter } from "./implementation/card-color-map.adapter";
import { CardFormatLegalityAdapter } from "./implementation/card-format_legality.adapter";
import { CardGameAdapter } from "./implementation/card-game.adapter";
import { CardImageAdapter } from "./implementation/card-image.adapter";
import { CardKeywordAdapter } from "./implementation/card-keyword.adapter";
import { CardMultiverseIdAdapter } from "./implementation/card-multi-verse-id.adapter";
import { CardSetAdapter } from "./implementation/card-set.adapter";
import { CardAdapter } from "./implementation/card.adapter";
import { CardfaceColorMapAdapter } from "./implementation/cardface-color-map.adapter";
import { CardFaceImageAdapter } from "./implementation/cardface-image.adapter";
import { CardfaceAdapter } from "./implementation/cardface.adapter";
import { CatalogAdapter } from "./implementation/catalog.adapter";
import { RulingLineAdapter } from "./implementation/ruling-line.adapter";
import { RulingAdapter } from "./implementation/ruling.adapter";
import { SymbologyAlternativeAdapter } from "./implementation/symbology-alternative.adapter";
import { SymbologyColorMapAdapter } from "./implementation/symbology-color-map.adapter";
import { SymbologyAdapter } from "./implementation/symbology.adapter";
import ADAPTTOKENS, {
  ICardAdapter, ICardCardMapAdapter, ICardColorMapAdapter, ICardFormatLegalityAdapter, ICardGameAdapter, ICardImageAdapter, ICardKeywordAdapter, ICardMultiverseIdAdapter,
  ICardSetAdapter, ICardfaceAdapter, ICardfaceColorMapAdapter, ICardfaceImageAdapter,
  ICatalogAdapter, IRulingAdapter, IRulingLineAdapter,
  ISymbologyAdapter, ISymbologyAlternativeAdapter, ISymbologyColorMapAdapter
} from "./interface";

export class AdaptDi {

  public static registerAdapters() {
    container.register<ICardCardMapAdapter>(ADAPTTOKENS.CardCardMapAdapter, { useClass: CardCardMapAdapter });
    container.register<ICardColorMapAdapter>(ADAPTTOKENS.CardColorMapAdapter, { useClass: CardColorMapAdapter });
    container.register<ICardFormatLegalityAdapter>(ADAPTTOKENS.CardFormatLegalityAdapter, { useClass: CardFormatLegalityAdapter });
    container.register<ICardGameAdapter>(ADAPTTOKENS.CardGameAdapter, { useClass: CardGameAdapter });
    container.register<ICardImageAdapter>(ADAPTTOKENS.CardImageAdapter, { useClass: CardImageAdapter });
    container.register<ICardKeywordAdapter>(ADAPTTOKENS.CardKeywordAdapter, { useClass: CardKeywordAdapter });
    container.register<ICardMultiverseIdAdapter>(ADAPTTOKENS.CardMultiverseIdAdapter, { useClass: CardMultiverseIdAdapter });
    container.register<ICardSetAdapter>(ADAPTTOKENS.CardSetAdapter, { useClass: CardSetAdapter });
    container.register<ICardAdapter>(ADAPTTOKENS.CardAdapter, { useClass: CardAdapter });
    container.register<ICardfaceAdapter>(ADAPTTOKENS.CardfaceAdapter, { useClass: CardfaceAdapter });
    container.register<ICardfaceColorMapAdapter>(ADAPTTOKENS.CardfaceColorMapAdapter, { useClass: CardfaceColorMapAdapter });
    container.register<ICardfaceImageAdapter>(ADAPTTOKENS.CardfaceImageAdapter, { useClass: CardFaceImageAdapter });
    container.register<ICatalogAdapter>(ADAPTTOKENS.CatalogAdapter, { useClass: CatalogAdapter });
    container.register<IRulingLineAdapter>(ADAPTTOKENS.RulingLineAdapter, { useClass: RulingLineAdapter });
    container.register<IRulingAdapter>(ADAPTTOKENS.RulingAdapter, { useClass: RulingAdapter });
    container.register<ISymbologyAlternativeAdapter>(ADAPTTOKENS.SymbologyAlternativeAdapter, { useClass: SymbologyAlternativeAdapter });
    container.register<ISymbologyColorMapAdapter>(ADAPTTOKENS.SymbologyColorMapAdapter, { useClass: SymbologyColorMapAdapter });
    container.register<ISymbologyAdapter>(ADAPTTOKENS.SymbologyAdapter, { useClass: SymbologyAdapter });
  }
}
