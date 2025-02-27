import { CardSearchDto, CatalogItemDto } from "../../../../common/dto";
import { CardRarity, CatalogType, GameFormat } from "../../../../common/types";
import { BaseViewmodel } from "../../../common/viewmodels/base.viewmodel";


export class CardSearchViewmodel extends BaseViewmodel<CardSearchDto> {
  //#region Getters - Setters ---------------------------------------------------
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
    const initial: CardSearchDto = {
      selectedCatalogItems: new Array<CatalogItemDto>(),
      selectedGameFormats: new Array<GameFormat>(),
      selectedRarities: ["mythic", "rare", "uncommon", "common"],
      selectedSets: new Array<string>()
    };
    initial.selectedRarities.sort((a: CardRarity, b: CardRarity) => a.localeCompare(b));
    super(initial);
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
    if (this._dto.selectedSets.length > 0) {
      queryParts.push(`sets=${this._dto.selectedSets.join(",")}`);
    }
    if (this._dto.selectedGameFormats.length > 0) {
      queryParts.push(`gameformats=${this._dto.selectedGameFormats.join(",")}`);
    }
    if (this._dto.selectedRarities.length > 0) {
      queryParts.push(`rarities=${this._dto.selectedRarities.join(",")}`);
    }
    return queryParts.join("&");
  }
  //#endregion
}
