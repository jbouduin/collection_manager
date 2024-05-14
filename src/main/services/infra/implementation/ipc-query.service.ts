import { inject, singleton } from "tsyringe";

import { IQueryOrSyncParam, QueryOrSyncOptions } from "../../../../common/ipc-params";
import { CardQueryOptions } from "../../../../common/ipc-params/card-query.options";
import { CatalogItem, Color, Language } from "../../../../main/database/schema";
import REPOTOKENS, { ICardRepository, ICardSetRepository, IColorRepository, ILanguageRepository, ISymbologyRepository } from "../../repo/interfaces";
import INFRATOKENS, { IDatabaseService, IIpcQueryService } from "../interfaces";


@singleton()
export class IpcQueryService implements IIpcQueryService {

    // NOW use container to resolve repositories
  //#region Private readonly properties ---------------------------------------
  private readonly databaseService: IDatabaseService;
  private readonly cardRepository: ICardRepository;
  private readonly cardSetRepository: ICardSetRepository;
  private readonly languageRepository: ILanguageRepository;
  private readonly colorRepository: IColorRepository;
  private readonly symbologyRepository: ISymbologyRepository;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(
    // the injected property should be removed over time
    @inject(INFRATOKENS.DatabaseService) databaseService: IDatabaseService,
    @inject(REPOTOKENS.CardRepository) cardRepository: ICardRepository,
    @inject(REPOTOKENS.CardSetRepository) cardSetRepository: ICardSetRepository,
    @inject(REPOTOKENS.ColorRepository) colorRepository: IColorRepository,
    @inject(REPOTOKENS.LanguageRepository) languageRepository: ILanguageRepository,
    @inject(REPOTOKENS.SymbologyRepository) symbologyRepository: ISymbologyRepository
  ) {
    this.databaseService = databaseService;
    this.cardRepository = cardRepository;
    this.cardSetRepository = cardSetRepository;
    this.colorRepository = colorRepository;
    this.languageRepository = languageRepository;
    this.symbologyRepository = symbologyRepository;
  }
  //#endregion

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  public async handle(params: IQueryOrSyncParam<QueryOrSyncOptions>): Promise<any> {
    console.log("start IpcQueryService.handling", params);
    switch (params.type) {
      case "Card":
        return this.cardRepository.getWithOptions(params.options as CardQueryOptions);
      case "CardSet":
        return this.cardSetRepository.getAll();
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
        return this.symbologyRepository.getAll();
      case "SymbologyCachedSvg":
        return this.symbologyRepository.getAllWithCachedSvg();
      case "Ruling":
        // TODO we should not do this
        break;
    }
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
