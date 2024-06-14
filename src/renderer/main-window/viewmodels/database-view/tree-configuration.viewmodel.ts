import { DtoDatabaseTreeViewConfiguration } from "../../../../common/dto";
import { DatabaseViewTreeConfigurationViewmodel } from "../../../common/viewmodels/configuration/database-view-tree-configuration.viewmodel";

export class TreeConfigurationViewmodel extends DatabaseViewTreeConfigurationViewmodel {

  //#region private fields ----------------------------------------------------
  private _cardSetFilterValue: string;
  //#endregion

  //#region getters/setters ---------------------------------------------------
  public get cardSetFilterValue(): string {
    return this._cardSetFilterValue;
  }

  public set cardSetFilterValue(value: string) {
    this._cardSetFilterValue = value;
  }
  //#endregion

  //#region Constructor -------------------------------------------------------
  public constructor(dto: DtoDatabaseTreeViewConfiguration) {
    super(dto);
    this._cardSetFilterValue = null;
  }
  //#endregion


}
