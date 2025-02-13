import { container } from "tsyringe";

import { CardSetRepository } from "./implementation/card-set.repository";
import { CardRepository } from "./implementation/card.repository";
import { CatalogRepository } from "./implementation/catalog.repository";
import { ColorRepository } from "./implementation/color-repository";
import { LanguageRepository } from "./implementation/language.repository";
import { OracleRepository } from "./implementation/oracle.repository";
import { CardSymbolRepository } from "./implementation/card-symbol.repository";
import REPOTOKENS, { ICardRepository, ICardSetRepository, ICatalogRepository, IColorRepository, ILanguageRepository, IOracleRepository, ICardSymbolRepository } from "./interfaces";
import { ICollectionRepository } from "./interfaces/collection.repository";
import { CollectionRepository } from "./implementation/collection.repository";


export class RepositoryDi {
  public static registerRepositories() {
    container.register<ICardSetRepository>(REPOTOKENS.CardSetRepository, { useClass: CardSetRepository });
    container.register<ICardRepository>(REPOTOKENS.CardRepository, { useClass: CardRepository });
    container.register<ICatalogRepository>(REPOTOKENS.CatalogRepository, { useClass: CatalogRepository });
    container.register<IColorRepository>(REPOTOKENS.ColorRepository, { useClass: ColorRepository });
    container.register<ICollectionRepository>(REPOTOKENS.CollectionRepository, { useClass: CollectionRepository });
    container.register<ILanguageRepository>(REPOTOKENS.LanguageRepository, { useClass: LanguageRepository });
    container.register<IOracleRepository>(REPOTOKENS.OracleRepository, { useClass: OracleRepository });
    container.register<ICardSymbolRepository>(REPOTOKENS.CardSymbolRepository, { useClass: CardSymbolRepository });
  }
}
