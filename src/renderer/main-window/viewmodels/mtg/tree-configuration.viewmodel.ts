import { IMtgSetTreeViewConfigurationDto } from "../../../../common/dto";
import { MtgViewTreeConfigurationViewmodel } from "../../../shared/viewmodels";


export class TreeConfigurationViewmodel extends MtgViewTreeConfigurationViewmodel {
  //#region Constructor -------------------------------------------------------
  public constructor(dto: IMtgSetTreeViewConfigurationDto) {
    super(dto);
  }
  //#endregion
}
