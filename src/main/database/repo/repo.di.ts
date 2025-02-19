import { container } from "tsyringe";
import { REPOSITORIES } from "../../services/service.tokens";
import { CardConditionRepository } from "./implementation/card-condition.repository";
import { CardSetRepository } from "./implementation/card-set.repository";
import { CardSymbolRepository } from "./implementation/card-symbol.repository";
import { CardRepository } from "./implementation/card.repository";
import { CatalogRepository } from "./implementation/catalog.repository";
import { CollectionRepository } from "./implementation/collection.repository";
import { ColorRepository } from "./implementation/color-repository";
import { LanguageRepository } from "./implementation/language.repository";
import { OracleRepository } from "./implementation/oracle.repository";
import { ICardConditionRepository, ICardRepository, ICardSetRepository, ICardSymbolRepository, ICatalogRepository, IColorRepository, ILanguageRepository, IOracleRepository } from "./interfaces";
import { ICollectionRepository } from "./interfaces/collection.repository";


export class RepositoryDi {
  public static registerRepositories() {
    container.register<ICardConditionRepository>(REPOSITORIES.CardConditionRepository, { useClass: CardConditionRepository });
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
