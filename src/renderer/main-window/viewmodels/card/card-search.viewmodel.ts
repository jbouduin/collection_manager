import { ICardQueryDto, ICatalogItemDto, IColorDto, QUERY_PARAM_LIST_SEPARATOR, CardQueryParamToken } from "../../../../common/dto";
import { CardRarity, CatalogType, MtgGameFormat, MtgColor, MtgColorType } from "../../../../common/types";
import { SelectOption } from "../../../shared/components/utils";
import { BaseViewmodel } from "../../../shared/viewmodels";
import { CardSetViewmodel } from "../card-set";


export class CardSearchViewmodel extends BaseViewmodel<ICardQueryDto> {
  //#region private fields ------------------------------------------------------
  private _selectedCardSets: Array<CardSetViewmodel>;
  private _selectedCardColors: Array<IColorDto>;
  private _selectedGameFormats: Array<SelectOption<MtgGameFormat>>;
  private _selectedIdentityColors: Array<IColorDto>;
  private _selectedProducedManaColors: Array<IColorDto>;
  private _selectedRarities: Array<SelectOption<CardRarity>>;
  //#endregion

  //#region Getters - Setters ---------------------------------------------------
  public get ownedCards(): boolean {
    return this._dto.ownedCards;
  }

  public set ownedCards(value: boolean) {
    this._dto.ownedCards = value;
  }

  public get selectedCardColors(): Array<IColorDto> {
    return this._selectedCardColors;
  }

  public get selectedIdentityColors(): Array<IColorDto> {
    return this._selectedIdentityColors;
  }

  public get selectedProducedManaColors(): Array<IColorDto> {
    return this._selectedProducedManaColors;
  }

  public get selectedGameFormats(): Array<SelectOption<MtgGameFormat>> {
    return this._selectedGameFormats;
  }

  public get selectedRarities(): Array<SelectOption<CardRarity>> {
    return this._selectedRarities;
  }

  public get selectedCardSets(): Array<CardSetViewmodel> {
    return this._selectedCardSets;
  }
  //#endregion

  //#region Constructor -------------------------------------------------------
  public constructor() {
    const initial: ICardQueryDto = {
      /*
       * TODO extend owned cards functionality
       * - currently owned cards is searching by card.id => this excludes reprints from the search
       * - extend with cards I don't own
       */
      ownedCards: false,
      selectedCardColors: new Array<MtgColor>(),
      selectedCatalogItems: new Array<ICatalogItemDto>(),
      selectedGameFormats: new Array<MtgGameFormat>(),
      selectedIdentityColors: new Array<MtgColor>(),
      selectedProducedManaColors: new Array<MtgColor>(),
      selectedRarities: new Array<CardRarity>(),
      selectedSets: new Array<string>()
    };
    initial.selectedRarities.sort((a: CardRarity, b: CardRarity) => a.localeCompare(b));
    super(initial);
    this._selectedCardSets = new Array<CardSetViewmodel>();
    this._selectedCardColors = new Array<IColorDto>();
    this._selectedGameFormats = new Array<SelectOption<MtgGameFormat>>();
    this._selectedIdentityColors = new Array<IColorDto>();
    this._selectedProducedManaColors = new Array<IColorDto>();
    this._selectedRarities = new Array<SelectOption<CardRarity>>();
  }
  //#endregion

  //#region CardColors --------------------------------------------------------
  public addColor(type: MtgColorType, color: IColorDto): void {
    switch (type) {
      case "card":
        this._dto.selectedCardColors.push(color.id);
        this._selectedCardColors.push(color);
        this._selectedCardColors.sort((a: IColorDto, b: IColorDto) => a.sequence - b.sequence);
        break;
      case "identity":
        this._dto.selectedIdentityColors.push(color.id);
        this._selectedIdentityColors.push(color);
        this._selectedIdentityColors.sort((a: IColorDto, b: IColorDto) => a.sequence - b.sequence);
        break;
      case "produced_mana":
        this._dto.selectedProducedManaColors.push(color.id);
        this._selectedProducedManaColors.push(color);
        this._selectedProducedManaColors.sort((a: IColorDto, b: IColorDto) => a.sequence - b.sequence);
        break;
    }
  }

  public removeColor(type: MtgColorType, color: IColorDto): void {
    switch (type) {
      case "card": {
        let idx = this._dto.selectedCardColors.indexOf(color.id);
        this._dto.selectedCardColors.splice(idx, 1);
        idx = this._selectedCardColors.findIndex((c: IColorDto) => c.id == color.id);
        this._selectedCardColors.splice(idx, 1);
        break;
      }
      case "identity": {
        let idx = this._dto.selectedIdentityColors.indexOf(color.id);
        this._dto.selectedIdentityColors.splice(idx, 1);
        idx = this._selectedIdentityColors.findIndex((c: IColorDto) => c.id == color.id);
        this._selectedIdentityColors.splice(idx, 1);
        break;
      }
      case "produced_mana": {
        let idx = this._dto.selectedProducedManaColors.indexOf(color.id);
        this._dto.selectedProducedManaColors.splice(idx, 1);
        idx = this._selectedProducedManaColors.findIndex((c: IColorDto) => c.id == color.id);
        this._selectedProducedManaColors.splice(idx, 1);
        break;
      }
    }
  }

  public clearColorSelection(type: MtgColorType): void {
    switch (type) {
      case "card":
        this._dto.selectedCardColors.splice(0);
        this._selectedCardColors.splice(0);
        break;
      case "identity":
        this._dto.selectedIdentityColors.splice(0);
        this._selectedIdentityColors.splice(0);
        break;
      case "produced_mana":
        this._dto.selectedProducedManaColors.splice(0);
        this._selectedProducedManaColors.splice(0);
        break;
    }
  }
  //#endregion

  //#region GameFormat --------------------------------------------------------
  public addGameFormat(gameFormat: SelectOption<MtgGameFormat>): void {
    this._dto.selectedGameFormats.push(gameFormat.value);
    this._selectedGameFormats.push(gameFormat);
    this._selectedGameFormats.sort((a: SelectOption<MtgGameFormat>, b: SelectOption<MtgGameFormat>) => a.label.localeCompare(b.label));
  }

  public removeGameFormat(gameFormat: SelectOption<MtgGameFormat>): void {
    let idx = this._dto.selectedGameFormats.indexOf(gameFormat.value);
    this._dto.selectedGameFormats.splice(idx, 1);
    idx = this._selectedGameFormats.findIndex((g: SelectOption<MtgGameFormat>) => g.value == gameFormat.value);
    this._selectedGameFormats.splice(idx, 1);
  }

  public clearGameFormatSelection(): void {
    this._dto.selectedGameFormats.splice(0);
    this._selectedGameFormats.splice(0);
  }
  //#endregion

  //#region Rarity ------------------------------------------------------------
  public addRarity(rarity: SelectOption<CardRarity>): void {
    this._dto.selectedRarities.push(rarity.value);
    this._selectedRarities.push(rarity);
    this._selectedRarities.sort((a: SelectOption<CardRarity>, b: SelectOption<CardRarity>) => a.label.localeCompare(b.label));
  }

  public removeRarity(rarity: SelectOption<CardRarity>): void {
    let idx = this._dto.selectedRarities.indexOf(rarity.value);
    this._dto.selectedRarities.splice(idx, 1);
    idx = this.selectedRarities.findIndex((r: SelectOption<CardRarity>) => r.value == rarity.value);
    this._selectedRarities.splice(idx, 1);
  }

  public clearRaritiesSelection(): void {
    this._dto.selectedRarities.splice(0);
    this._selectedRarities.splice(0);
  }
  //#endregion

  //#region Card set ----------------------------------------------------------
  public addCardSet(cardSet: CardSetViewmodel): void {
    this._dto.selectedSets.push(cardSet.id);
    this._dto.selectedSets.sort((a: string, b: string) => a.localeCompare(b));
    this._selectedCardSets.push(cardSet);
  }

  public removeCardSet(cardSet: CardSetViewmodel): void {
    let idx = this._dto.selectedSets.indexOf(cardSet.id);
    this._dto.selectedSets.splice(idx, 1);
    idx = this._selectedCardSets.findIndex((vm: CardSetViewmodel) => vm.id == cardSet.id);
    this._selectedCardSets.splice(idx, 1);
  }

  public clearCardSetSelection(): void {
    this._dto.selectedSets.splice(0);
    this._selectedCardSets.splice(0);
  }
  //#endregion

  //#region Catalogs ----------------------------------------------------------
  public addCatalogItem(item: ICatalogItemDto): void {
    this._dto.selectedCatalogItems.push(item);
    this._dto.selectedCatalogItems.sort((a: ICatalogItemDto, b: ICatalogItemDto) => {
      const compareType = a.catalog_name.localeCompare(b.catalog_name);
      if (compareType == 0) {
        return a.item.localeCompare(b.item);
      } else {
        return compareType;
      }
    });
  }

  public removeCatalogItem(item: ICatalogItemDto): void {
    const idx = this._dto.selectedCatalogItems.indexOf(item);
    this._dto.selectedCatalogItems.splice(idx, 1);
  }

  public getSelectedCatalogItems(catalogType: CatalogType): Array<ICatalogItemDto> {
    return this._dto.selectedCatalogItems.filter((item: ICatalogItemDto) => item.catalog_name == catalogType);
  }

  public clearCatalogSelection(catalogType: CatalogType): void {
    let idx = this._dto.selectedCatalogItems.findIndex((item: ICatalogItemDto) => item.catalog_name == catalogType);
    while (idx >= 0) {
      this._dto.selectedCatalogItems.splice(idx, 1);
      idx = this._dto.selectedCatalogItems.findIndex((item: ICatalogItemDto) => item.catalog_name == catalogType);
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
      (prev: Map<CatalogType, Array<string>>, current: ICatalogItemDto) => {
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
  private appendToQueryParam(queryParts: Array<string>, token: CardQueryParamToken, values: Array<string>): Array<string> {
    queryParts.push(`${token}=${values.join(QUERY_PARAM_LIST_SEPARATOR)}`);
    return queryParts;
  }
  //#endregion
}
