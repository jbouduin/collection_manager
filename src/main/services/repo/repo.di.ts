import { container } from "tsyringe";

import { CardSetRepository } from "./implementation/card-set.repository";
import { CardRepository } from "./implementation/card.repository";
import { CatalogRepository } from "./implementation/catalog.repository";
import { ColorRepository } from "./implementation/color-repository";
import { LanguageRepository } from "./implementation/language.repository";
import { OracleRepository } from "./implementation/oracle.repository";
import { CardSymbolRepository } from "./implementation/card-symbol.repository";
import { ICardRepository, ICardSetRepository, ICatalogRepository, IColorRepository, ILanguageRepository, IOracleRepository, ICardSymbolRepository } from "./interfaces";
import { ICollectionRepository } from "./interfaces/collection.repository";
import { CollectionRepository } from "./implementation/collection.repository";
import { REPOSITORIES } from "../service.tokens";


export class RepositoryDi {
  public static registerRepositories() {
    container.register<ICardSetRepository>(REPOSITORIES.CardSetRepository, { useClass: CardSetRepository });
    container.register<ICardRepository>(REPOSITORIES.CardRepository, { useClass: CardRepository });
    container.register<ICatalogRepository>(REPOSITORIES.CatalogRepository, { useClass: CatalogRepository });
    container.register<IColorRepository>(REPOSITORIES.ColorRepository, { useClass: ColorRepository });
    container.register<ICollectionRepository>(REPOSITORIES.CollectionRepository, { useClass: CollectionRepository });
    container.register<ILanguageRepository>(REPOSITORIES.LanguageRepository, { useClass: LanguageRepository });
    container.register<IOracleRepository>(REPOSITORIES.OracleRepository, { useClass: OracleRepository });
    container.register<ICardSymbolRepository>(REPOSITORIES.CardSymbolRepository, { useClass: CardSymbolRepository });
  }
}
