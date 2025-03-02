import { DatabaseTreeViewConfigurationDto } from "../../../../common/dto";
import { MtgViewTreeConfigurationViewmodel } from "../../../common/viewmodels";


export class TreeConfigurationViewmodel extends MtgViewTreeConfigurationViewmodel {
  //#region Constructor -------------------------------------------------------
  public constructor(dto: DatabaseTreeViewConfigurationDto) {
    super(dto);
  }
  //#endregion
}
