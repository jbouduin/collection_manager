import { MtgSetTreeViewConfigurationDto } from "../../../../common/dto";
import { MtgViewTreeConfigurationViewmodel } from "../../../common/viewmodels";


export class TreeConfigurationViewmodel extends MtgViewTreeConfigurationViewmodel {
  //#region Constructor -------------------------------------------------------
  public constructor(dto: MtgSetTreeViewConfigurationDto) {
    super(dto);
  }
  //#endregion
}
