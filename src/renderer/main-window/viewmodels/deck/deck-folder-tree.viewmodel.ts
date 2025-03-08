import { DeckFolderDto } from "../../../../common/dto";
import { BaseTreeNodeViewmodel } from "../../../shared/components/base";

export class DeckFolderTreeViewmodel implements BaseTreeNodeViewmodel {
  //#region private fields ----------------------------------------------------
  private readonly _deck: DeckFolderDto;
  //#endregion

  //#region public fields -----------------------------------------------------
  public isSelected: boolean;
  public isExpanded: boolean;
  //#endregion

  //#region Getters/Setters ---------------------------------------------------
  public get id(): number {
    return this._deck.id;
  }

  public get isFolder(): boolean {
    return this._deck.is_folder;
  }

  public get isSystem(): boolean {
    return this._deck.is_system;
  }

  public get name(): string {
    return this._deck.name;
  }

  public get parentId(): number {
    return this._deck.parent_id;
  }

  public get dto(): DeckFolderDto {
    return this._deck;
  }
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(deck: DeckFolderDto, isSelected: boolean, isExpanded: boolean) {
    this._deck = deck;
    this.isSelected = isSelected;
    this.isExpanded = isExpanded;
  }
  //#endregion
}
