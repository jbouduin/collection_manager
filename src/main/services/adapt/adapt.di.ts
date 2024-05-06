
import { Lifecycle, container } from "tsyringe";

import { CardCardMapAdapter } from "./implementation/card-card-map.adapter";
import { CardColorMapAdapter } from "./implementation/card-color-map.adapter";
import { CardFormatLegalityAdapter } from "./implementation/card-format_legality.adapter";
import { CardGameAdapter } from "./implementation/card-game.adapter";
import { CardImageAdapter } from "./implementation/card-image.adapter";
import { CardMultiverseIdAdapter } from "./implementation/card-multi-verse-id.adapter";
import { CardSetAdapter } from "./implementation/card-set.adapter";
import { CardAdapter } from "./implementation/card.adapter";
import { CatalogAdapter } from "./implementation/catalog.adapter";
import { RulingLineAdapter } from "./implementation/ruling-line.adapter";
import { RulingAdapter } from "./implementation/ruling.adapter";
import { SymbologyAlternativeAdapter } from "./implementation/symbology-alternative.adapter";
import { SymbologyColorMapAdapter } from "./implementation/symbology-color-map.adapter";
import { SymbologyAdapter } from "./implementation/symbology.adapter";
import ADAPTTOKENS, { ICardAdapter, ICardCardMapAdapter, ICardColorMapAdapter, ICardFormatLegalityAdapter, ICardGameAdapter, ICardImageAdapter, ICardKeywordAdapter, ICardMultiverseIdAdapter, ICardSetAdapter, ICatalogAdapter, IRulingAdapter, IRulingLineAdapter, ISymbologyAdapter, ISymbologyAlternativeAdapter, ISymbologyColorMapAdapter } from "./interfaces";
import { CardKeywordAdapter } from "./implementation/card-keyword.adapter";

export class AdaptDi {

  public static registerAdapters() {
    container.register<ICardCardMapAdapter>(ADAPTTOKENS.CardCardMapAdapter, { useClass: CardCardMapAdapter }, { lifecycle: Lifecycle.ResolutionScoped });
    container.register<ICardColorMapAdapter>(ADAPTTOKENS.CardColorMapAdapter, { useClass: CardColorMapAdapter }, { lifecycle: Lifecycle.ResolutionScoped });
    container.register<ICardFormatLegalityAdapter>(ADAPTTOKENS.CardFormatLegalityAdapter, { useClass: CardFormatLegalityAdapter }, { lifecycle: Lifecycle.ResolutionScoped });
    container.register<ICardGameAdapter>(ADAPTTOKENS.CardGameAdapter, { useClass: CardGameAdapter }, { lifecycle: Lifecycle.ResolutionScoped });
    container.register<ICardImageAdapter>(ADAPTTOKENS.CardImageAdapter, { useClass: CardImageAdapter }, { lifecycle: Lifecycle.ResolutionScoped });
    container.register<ICardKeywordAdapter>(ADAPTTOKENS.CardKeywordAdapter, { useClass: CardKeywordAdapter }, { lifecycle: Lifecycle.ResolutionScoped });
    container.register<ICardMultiverseIdAdapter>(ADAPTTOKENS.CardMultiverseIdAdapter, { useClass: CardMultiverseIdAdapter }, { lifecycle: Lifecycle.ResolutionScoped });
    container.register<ICardSetAdapter>(ADAPTTOKENS.CardSetAdapter, { useClass: CardSetAdapter }, { lifecycle: Lifecycle.ResolutionScoped });
    container.register<ICardAdapter>(ADAPTTOKENS.CardAdapter, { useClass: CardAdapter }, { lifecycle: Lifecycle.ResolutionScoped });
    container.register<ICatalogAdapter>(ADAPTTOKENS.CatalogAdapter, { useClass: CatalogAdapter }, { lifecycle: Lifecycle.ResolutionScoped });
    container.register<IRulingLineAdapter>(ADAPTTOKENS.RulingLineAdapter, { useClass: RulingLineAdapter }, { lifecycle: Lifecycle.ResolutionScoped });
    container.register<IRulingAdapter>(ADAPTTOKENS.RulingAdapter, { useClass: RulingAdapter }, { lifecycle: Lifecycle.ResolutionScoped });
    container.register<ISymbologyAlternativeAdapter>(ADAPTTOKENS.SymbologyAlternativeAdapter, { useClass: SymbologyAlternativeAdapter }, { lifecycle: Lifecycle.ResolutionScoped });
    container.register<ISymbologyColorMapAdapter>(ADAPTTOKENS.SymbologyColorMapAdapter, { useClass: SymbologyColorMapAdapter }, { lifecycle: Lifecycle.ResolutionScoped });
    container.register<ISymbologyAdapter>(ADAPTTOKENS.SymbologyAdapter, { useClass: SymbologyAdapter }, { lifecycle: Lifecycle.ResolutionScoped });
  }
}
