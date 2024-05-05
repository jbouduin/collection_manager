
import { Lifecycle, container } from "tsyringe";

import { CardSetAdapter } from "./implementation/card-set.adapter";
import { CardAdapter } from "./implementation/card.adapter";
import { CatalogAdapter } from "./implementation/catalog.adapter";
import { SymbologyAdapter } from "./implementation/symbology.adapter";
import ADAPTTOKENS, { ICardAdapter, ICardSetAdapter, ICatalogAdapter, ISymbologyAdapter } from "./interfaces";

export class AdaptDi {

  public static registerAdapters() {
    container.register<ICardSetAdapter>(ADAPTTOKENS.CardSetAdapter, { useClass: CardSetAdapter }, { lifecycle: Lifecycle.ResolutionScoped });
    container.register<ICardAdapter>(ADAPTTOKENS.CardAdapter, { useClass: CardAdapter }, { lifecycle: Lifecycle.ResolutionScoped });
    container.register<ICatalogAdapter>(ADAPTTOKENS.CatalogAdapter, { useClass: CatalogAdapter }, { lifecycle: Lifecycle.ResolutionScoped });
    container.register<ISymbologyAdapter>(ADAPTTOKENS.SymbologyAdapter, { useClass: SymbologyAdapter }, { lifecycle: Lifecycle.ResolutionScoped });
  }
}
