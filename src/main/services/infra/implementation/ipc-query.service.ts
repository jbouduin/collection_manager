import { inject, singleton } from "tsyringe";

import { SymbologySelectDto } from "../../../../common/dto/select/symbology.select.dto";
import { IQueryOrSyncParam, QueryOrSyncOptions } from "../../../../common/ipc-params";
import { CardSet, CatalogItem, Color, Language } from "../../../../main/database/schema";
import REPOTOKENS, { IColorRepository, ILanguageRepository, ISymbologyRepository } from "../../repo/interfaces";
import INFRATOKENS, { IDatabaseService, IIpcQueryService } from "../interfaces";


@singleton()
export class IpcQueryService implements IIpcQueryService {

  private readonly databaseService: IDatabaseService;
  private readonly languageRepository: ILanguageRepository;
  private readonly colorRepository: IColorRepository;
  private readonly symbologyRepository: ISymbologyRepository;

  public constructor(
    // the injected property should be removed over time
    @inject(INFRATOKENS.DatabaseService) databaseService: IDatabaseService,
    @inject(REPOTOKENS.ColorRepository) colorRepository: IColorRepository,
    @inject(REPOTOKENS.LanguageRepository) languageRepository: ILanguageRepository,
    @inject(REPOTOKENS.SymbologyRepository) symbologyRepository: ISymbologyRepository
  ) {
    this.databaseService = databaseService;
    this.colorRepository = colorRepository;
    this.languageRepository = languageRepository;
    this.symbologyRepository = symbologyRepository;
  }

  public async handle(params: IQueryOrSyncParam<QueryOrSyncOptions>): Promise<void> {
    switch (params.type) {
      case "Card":
        break;
      case "CardSet":
        await this.TestQueryCardSet();
        break;
      case "Catalog":
        await this.TestQueryCatalog();
        break;
      case "Color":
        await this.colorRepository.getAll()
          .then((result: Array<Color>) =>
            result.forEach((color: Color) => console.log(color.id, color.land_type, color.display_text, color.mana_symbol))
          );
        break;
      case "Language":
        await this.languageRepository.getAll()
          .then((result: Array<Language>) =>
            result.forEach((lng: Language) => console.log(lng.id, lng.printed_code, lng.display_text, lng.button_text))
          );
        break;
      case "Symbology":
        await this.symbologyRepository.getAll()
          .then((result: Array<SymbologySelectDto>) => console.log(result.length > 0 ? result[0] : "nothing found"));
        break;
      case "Ruling":
        // TODO we should not do this
        break;
    }
  }

  private async TestQueryCardSet(): Promise<void> {
    await this.databaseService.database
      .selectFrom("card_set")
      .selectAll()
      .limit(1)
      .execute()
      .then((cardSet: Array<CardSet>) => {
        console.log(typeof cardSet[0]);
        console.log(cardSet[0]);
      });
  }

  private async TestQueryCatalog(): Promise<void> {
    const qb = this.databaseService.database
      .selectFrom("catalog_item")
      .selectAll("catalog_item")
      .where("catalog_name", "=", "ArtifactTypes")
      .limit(1);

    await qb.execute()
      .then((catalogItem: Array<CatalogItem>) => {
        console.log(typeof catalogItem[0]);
        console.log(catalogItem[0]);
      });
  }
}
