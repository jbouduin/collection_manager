import { CardQueryDto, CatalogItemDto, ColorDto, QUERY_PARAM_LIST_SEPARATOR, QueryParamToken } from "../../../../common/dto";
import { CardRarity, CatalogType, GameFormat, MTGColor, MTGColorType } from "../../../../common/types";
import { BaseViewmodel } from "../../../common/viewmodels";


export class CardSearchViewmodel extends BaseViewmodel<CardQueryDto> {
  //#region Getters - Setters ---------------------------------------------------
  public get ownedCards(): boolean {
    return this._dto.ownedCards;
  }

  public set ownedCards(value: boolean) {
    this._dto.ownedCards = value;
  }

  public get selectedCardColors(): Array<MTGColor> {
    return this._dto.selectedIdentityColors;
  }

  public get selectedIdentityColors(): Array<MTGColor> {
    return this._dto.selectedIdentityColors;
  }

  public get selectedProducedManaColors(): Array<MTGColor> {
    return this._dto.selectedProducedManaColors;
  }

  public get selectedGameFormats(): Array<GameFormat> {
    return this._dto.selectedGameFormats;
  }

  public get selectedRarities(): Array<CardRarity> {
    return this._dto.selectedRarities;
  }

  public get selectedSets(): Array<string> {
    return this._dto.selectedSets;
  }
  //#endregion

  //#region Constructor -------------------------------------------------------
  public constructor() {
    const initial: CardQueryDto = {
      /*
       * TODO extend owned cards functionality
       * - currently owned cards is searching by card.id => this excludes reprints from the search
       * - extend with cards I don't own
       */
      ownedCards: false,
      selectedCardColors: new Array<MTGColor>(),
      selectedCatalogItems: new Array<CatalogItemDto>(),
      selectedGameFormats: new Array<GameFormat>(),
      selectedIdentityColors: new Array<MTGColor>(),
      selectedProducedManaColors: new Array<MTGColor>(),
      selectedRarities: ["mythic", "rare", "uncommon", "common"],
      selectedSets: new Array<string>()
    };
    initial.selectedRarities.sort((a: CardRarity, b: CardRarity) => a.localeCompare(b));
    super(initial);
  }
  //#endregion

  //#region CardColors --------------------------------------------------------
  public addColor(type: MTGColorType, color: MTGColor, allColors: Array<ColorDto>): void {
    switch (type) {
      case "card":
        this._dto.selectedCardColors.push(color);
        this.sortColors(this._dto.selectedCardColors, allColors);
        break;
      case "identity":
        this._dto.selectedIdentityColors.push(color);
        this.sortColors(this._dto.selectedIdentityColors, allColors);
        break;
      case "produced_mana":
        this._dto.selectedProducedManaColors.push(color);
        this.sortColors(this._dto.selectedProducedManaColors, allColors);
        break;
    }
  }

  public removeColor(type: MTGColorType, color: MTGColor): void {
    switch (type) {
      case "card": {
        const idx = this._dto.selectedCardColors.indexOf(color);
        this._dto.selectedCardColors.splice(idx, 1);
        break;
      }
      case "identity": {
        const idx = this._dto.selectedIdentityColors.indexOf(color);
        this._dto.selectedIdentityColors.splice(idx, 1);
        break;
      }
      case "produced_mana": {
        const idx = this._dto.selectedProducedManaColors.indexOf(color);
        this._dto.selectedProducedManaColors.splice(idx, 1);
        break;
      }
    }
  }

  public clearColorSelection(type: MTGColorType): void {
    switch (type) {
      case "card":
        this._dto.selectedCardColors.splice(0);
        break;
      case "identity":
        this._dto.selectedIdentityColors.splice(0);
        break;
      case "produced_mana":
        this._dto.selectedIdentityColors.splice(0);
        break;
    }
  }
  //#endregion

  //#region GameFormat --------------------------------------------------------
  public addGameFormat(gameFormat: GameFormat): void {
    this._dto.selectedGameFormats.push(gameFormat);
    this._dto.selectedGameFormats.sort((a: GameFormat, b: GameFormat) => a.localeCompare(b));
  }

  public removeGameFormat(gameFormat: GameFormat): void {
    const idx = this._dto.selectedGameFormats.indexOf(gameFormat);
    this._dto.selectedGameFormats.splice(idx, 1);
  }

  public clearGameFormatSelection(): void {
    this._dto.selectedGameFormats.splice(0);
  }
  //#endregion

  //#region Rarity ------------------------------------------------------------
  public addRarity(rarity: CardRarity): void {
    this._dto.selectedRarities.push(rarity);
    this._dto.selectedRarities.sort((a: CardRarity, b: CardRarity) => a.localeCompare(b));
  }

  public removeRarity(rarity: CardRarity): void {
    const idx = this._dto.selectedRarities.indexOf(rarity);
    this._dto.selectedRarities.splice(idx, 1);
  }

  public clearRaritiesSelection(): void {
    this._dto.selectedRarities.splice(0);
  }
  //#endregion

  //#region Card set ----------------------------------------------------------
  public addCardSet(cardSetId: string): void {
    this._dto.selectedSets.push(cardSetId);
    this._dto.selectedSets.sort((a: string, b: string) => a.localeCompare(b));
  }

  public removeCardSet(cardSetId: string): void {
    const idx = this._dto.selectedSets.indexOf(cardSetId);
    this._dto.selectedSets.splice(idx, 1);
  }

  public clearCardSetSelection(): void {
    this._dto.selectedSets.splice(0);
  }
  //#endregion

  //#region Catalogs ----------------------------------------------------------
  public addCatalogItem(item: CatalogItemDto): void {
    this._dto.selectedCatalogItems.push(item);
    this._dto.selectedCatalogItems.sort((a: CatalogItemDto, b: CatalogItemDto) => {
      const compareType = a.catalog_name.localeCompare(b.catalog_name);
      if (compareType == 0) {
        return a.item.localeCompare(b.item);
      } else {
        return compareType;
      }
    });
  }

  public removeCatalogItem(item: CatalogItemDto): void {
    const idx = this._dto.selectedCatalogItems.indexOf(item);
    this._dto.selectedCatalogItems.splice(idx, 1);
  }

  public getSelectedCatalogItems(catalogType: CatalogType): Array<CatalogItemDto> {
    return this._dto.selectedCatalogItems.filter((item: CatalogItemDto) => item.catalog_name == catalogType);
  }

  public clearCatalogSelection(catalogType: CatalogType): void {
    let idx = this._dto.selectedCatalogItems.findIndex((item: CatalogItemDto) => item.catalog_name == catalogType);
    while (idx >= 0) {
      this._dto.selectedCatalogItems.splice(idx, 1);
      idx = this._dto.selectedCatalogItems.findIndex((item: CatalogItemDto) => item.catalog_name == catalogType);
    }
  }
  //#endregion

  //#region Public methods ----------------------------------------------------
  public toQueryString(): string {
    const queryParts = new Array<string>();
    if (this._dto.selectedCardColors.length > 0) {
      this.appendToQueryParam(queryParts, "cc", this._dto.selectedCardColors);
    }
    if (this._dto.selectedIdentityColors.length > 0) {
      this.appendToQueryParam(queryParts, "ic", this._dto.selectedIdentityColors);
    }
    if (this._dto.selectedSets.length > 0) {
      this.appendToQueryParam(queryParts, "set", this._dto.selectedSets);
    }
    if (this._dto.selectedGameFormats.length > 0) {
      this.appendToQueryParam(queryParts, "format", this._dto.selectedGameFormats);
    }
    if (this._dto.selectedProducedManaColors.length > 0) {
      this.appendToQueryParam(queryParts, "pm", this._dto.selectedProducedManaColors);
    }
    if (this._dto.selectedRarities.length > 0) {
      this.appendToQueryParam(queryParts, "rarity", this._dto.selectedRarities);
    }
    const catalogItems = this._dto.selectedCatalogItems.reduce(
      (prev: Map<CatalogType, Array<string>>, current: CatalogItemDto) => {
        const catalog = prev.get(current.catalog_name);
        if (!catalog) {
          prev.set(current.catalog_name, new Array<string>(current.item));
        } else {
          catalog.push(current.item);
        }
        return prev;
      },
      new Map<CatalogType, Array<string>>()
    );
    if (this._dto.ownedCards) {
      this.appendToQueryParam(queryParts, "own", ["true"]);
    }
    catalogItems.forEach((items: Array<string>, catalog: CatalogType) => this.appendToQueryParam(queryParts, catalog, items));
    return queryParts.join("&");
  }
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  private appendToQueryParam(queryParts: Array<string>, token: QueryParamToken, values: Array<string>): Array<string> {
    queryParts.push(`${token}=${values.join(QUERY_PARAM_LIST_SEPARATOR)}`);
    return queryParts;
  }

  private sortColors(selectedColors: Array<MTGColor>, allColors: Array<ColorDto>): void {
    selectedColors.sort((a: MTGColor, b: MTGColor) => allColors.find((f: ColorDto) => f.id == a).sequence - allColors.find((f: ColorDto) => f.id == b).sequence);
  }
  //#endregion
}
