import { Props } from "@blueprintjs/core";
import { CardfaceViewmodel, OracleViewmodel } from "../../../../../main-window/viewmodels";

export interface CardfaceViewProps extends Props {
  cardface: CardfaceViewmodel;
  oracle: OracleViewmodel;

}
