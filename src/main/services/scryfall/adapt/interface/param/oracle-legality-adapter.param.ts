import { CardLegality, MtgGameFormat } from "../../../../../../common/types";


export type OracleLegalityAdapterParameter = {
  oracle_id: string;
  gameFormat: MtgGameFormat;
  legality: CardLegality;
};
