import { MtgSetTreeViewConfigurationDto } from "../../../../common/dto";
import { MtgViewTreeConfigurationViewmodel } from "../../../shared/viewmodels";


export class TreeConfigurationViewmodel extends MtgViewTreeConfigurationViewmodel {
  //#region Constructor -------------------------------------------------------
  public constructor(dto: MtgSetTreeViewConfigurationDto) {
    super(dto);
  }
  //#endregion
}
