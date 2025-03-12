import { IDeckFolderDto } from "../../../../common/dto";
import { IBaseTreeNodeViewmodel } from "../../../shared/components/base";

export class DeckFolderTreeViewmodel implements IBaseTreeNodeViewmodel {
  //#region private fields ----------------------------------------------------
  private readonly _deck: IDeckFolderDto;
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

  public get dto(): IDeckFolderDto {
    return this._deck;
  }
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(deck: IDeckFolderDto, isSelected: boolean, isExpanded: boolean) {
    this._deck = deck;
    this.isSelected = isSelected;
    this.isExpanded = isExpanded;
  }
  //#endregion
}
