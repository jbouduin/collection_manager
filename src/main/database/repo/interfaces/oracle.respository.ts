import { LegalityDto, RulingLineDto } from "../../../../common/dto";
import { IResult } from "../../../services/base";


export interface IOracleRepository {
  getByOracleId(oracleId: string): Promise<IResult<Array<RulingLineDto>>>;
  getLegalities(oracleId: string): Promise<IResult<Array<LegalityDto>>>;
}
