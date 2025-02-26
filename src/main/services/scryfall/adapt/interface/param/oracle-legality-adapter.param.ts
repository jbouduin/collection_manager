import { CardLegality, GameFormat } from "../../../../../../common/types";


export type OracleLegalityAdapterParameter = {
  oracle_id: string;
  gameFormat: GameFormat;
  legality: CardLegality;
};
