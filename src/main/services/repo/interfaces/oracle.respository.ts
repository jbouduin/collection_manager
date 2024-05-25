import { DtoLegality, DtoRulingLine  } from "../../../../common/dto";

export interface IOracleRepository {
  getByCardId(cardId: string): Promise<Array<DtoRulingLine>>;
  getLegalities(oracleId: string): Promise<Array<DtoLegality>>;
}
