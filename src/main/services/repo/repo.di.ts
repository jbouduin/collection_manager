import { Lifecycle, container } from "tsyringe";
import { CardSetRepository } from "./implementation/card-set.repository";
import { CardRepository } from "./implementation/card.repository";
import { CatalogRepository } from "./implementation/catalog.repository";
import { ColorRepository } from "./implementation/color-repository";
import { LanguageRepository } from "./implementation/language.repository";
import { SymbologyRepository } from "./implementation/symbology.repository";
import REPOTOKENS, { ICardRepository, ICardSetRepository, ICatalogRepository, IColorRepository, ILanguageRepository, IRulingRepository, ISymbologyRepository } from "./interfaces";
import { RulingRepository } from "./implementation/ruling.repository";


export class RepositoryDi {

  public static registerRepositories() {
    container.register<ICardSetRepository>(REPOTOKENS.CardSetRepository, { useClass: CardSetRepository }, { lifecycle: Lifecycle.Singleton });
    container.register<ICardRepository>(REPOTOKENS.CardRepository, { useClass: CardRepository }, { lifecycle: Lifecycle.Singleton });
    container.register<ICatalogRepository>(REPOTOKENS.CatalogRepository, { useClass: CatalogRepository }, { lifecycle: Lifecycle.Singleton });
    container.register<IColorRepository>(REPOTOKENS.ColorRepository, { useClass: ColorRepository }, { lifecycle: Lifecycle.Singleton });
    container.register<ILanguageRepository>(REPOTOKENS.LanguageRepository, { useClass: LanguageRepository }, { lifecycle: Lifecycle.Singleton });
    container.register<IRulingRepository>(REPOTOKENS.RulingRepository, { useClass: RulingRepository }, { lifecycle: Lifecycle.Singleton });
    container.register<ISymbologyRepository>(REPOTOKENS.SymbologyRepository, { useClass: SymbologyRepository }, { lifecycle: Lifecycle.Singleton });
  }
}
