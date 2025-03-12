import { ILegalityDto, IOracleRulingLineDto } from "../../../../common/dto";
import { IResult } from "../../../services/base";


export interface IOracleRepository {
  getByOracleId(oracleId: string): Promise<IResult<Array<IOracleRulingLineDto>>>;
  getLegalities(oracleId: string): Promise<IResult<Array<ILegalityDto>>>;
}
