import { DatabaseTreeViewConfigurationDto } from "../../../../common/dto";
import { DatabaseViewTreeConfigurationViewmodel } from "../../../common/viewmodels/configuration/database-view-tree-configuration.viewmodel";

export class TreeConfigurationViewmodel extends DatabaseViewTreeConfigurationViewmodel {
  //#region Constructor -------------------------------------------------------
  public constructor(dto: DatabaseTreeViewConfigurationDto) {
    super(dto);
  }
  //#endregion
}
