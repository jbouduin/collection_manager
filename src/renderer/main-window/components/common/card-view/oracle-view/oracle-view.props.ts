import { Props } from "@blueprintjs/core";

import { OracleViewmodel } from "../../../../viewmodels";

export interface OracleViewProps extends Props {
  oracle: OracleViewmodel;
  symbolSvgs: Map<string, string>;
}
