import { container } from "tsyringe";
import { REPOSITORIES } from "../../services/service.tokens";
import { CardConditionRepository } from "./implementation/card-condition.repository";
import { CardSetRepository } from "./implementation/card-set.repository";
import { CardSymbolRepository } from "./implementation/card-symbol.repository";
import { CardRepository } from "./implementation/card.repository";
import { CatalogRepository } from "./implementation/catalog.repository";
import { CollectionRepository } from "./implementation/collection.repository";
import { ColorRepository } from "./implementation/color.repository";
import { DeckRepository } from "./implementation/deck.repository";
import { GameFormatRepository } from "./implementation/game-format.repository";
import { LanguageRepository } from "./implementation/language.repository";
import { OracleRepository } from "./implementation/oracle.repository";
import * as Repository from "./interfaces";


export class RepositoryDi {
  public static registerRepositories() {
    container.register<Repository.ICardConditionRepository>(REPOSITORIES.CardConditionRepository, { useClass: CardConditionRepository });
    container.register<Repository.ICardRepository>(REPOSITORIES.CardRepository, { useClass: CardRepository });
    container.register<Repository.ICardSetRepository>(REPOSITORIES.CardSetRepository, { useClass: CardSetRepository });
    container.register<Repository.ICardSymbolRepository>(REPOSITORIES.CardSymbolRepository, { useClass: CardSymbolRepository });
    container.register<Repository.ICatalogRepository>(REPOSITORIES.CatalogRepository, { useClass: CatalogRepository });
    container.register<Repository.ICollectionRepository>(REPOSITORIES.CollectionRepository, { useClass: CollectionRepository });
    container.register<Repository.IColorRepository>(REPOSITORIES.ColorRepository, { useClass: ColorRepository });
    container.register<Repository.IDeckRepository>(REPOSITORIES.DeckRepository, { useClass: DeckRepository });
    container.register<Repository.IGameFormatRepository>(REPOSITORIES.GameFormatRepository, { useClass: GameFormatRepository });
    container.register<Repository.ILanguageRepository>(REPOSITORIES.LanguageRepository, { useClass: LanguageRepository });
    container.register<Repository.IOracleRepository>(REPOSITORIES.OracleRepository, { useClass: OracleRepository });
  }
}
