import { CardLegality, GameFormat } from "../../../../../../common/enums";

export type OracleLegalityAdapterParameter = {
  oracle_id: string;
  gameFormat: GameFormat;
  legality: CardLegality;
};
