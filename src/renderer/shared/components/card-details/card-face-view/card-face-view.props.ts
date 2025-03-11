import { Props } from "@blueprintjs/core";
import { MtgCardFaceViewmodel, OracleViewmodel } from "../../../viewmodels";


export interface CardfaceViewProps extends Props {
  cardface: MtgCardFaceViewmodel;
  oracle: OracleViewmodel;
}
