import { DtoOracle } from "../../../../common/dto";

export class OracleViewmodel {
  //#region private readonly fields -------------------------------------------
  private readonly _dtoOracle: DtoOracle;
  //#endregion

  //#region Public getters ----------------------------------------------------
  public get oracleText(): string {
    return this._dtoOracle.oracle_text;
  }

  public get oracleTypeLine(): string {
    return this._dtoOracle.type_line;
  }
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(dtoOracle: DtoOracle) {
    this._dtoOracle = dtoOracle;
  }
  //#endregion
}
